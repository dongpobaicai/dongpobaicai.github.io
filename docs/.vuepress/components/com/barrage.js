const {
  substring,
  getRandom,
  getFontSize
} = require("./util");

class Bullet {
  constructor(opt = {}) {
    this.bulletId = opt.bulletId;
  }
  /**
   * }
   */
  addContent(opt = {}) {
    const defaultBulletOpt = {
      duration: 0, // 动画时长
      passtime: 0, // 弹幕穿越右边界耗时
      headUrl: '', // 图片
      username: '', // 用户昵称
      content: "", // 描述
      width: 0, // 弹幕宽度
      height: 0, // 弹幕高度
      paused: false, // 是否暂停
    };
    Object.assign(this, defaultBulletOpt, opt);
  }

  removeContent() {
    this.addContent({});
  }
}

class Tunnel {
  constructor(opt = {}) {
    const defaultTunnelOpt = {
      tunnelId: 0,
      height: 0, // 轨道高度
      width: 0, // 轨道宽度
      safeGap: 4, // 相邻弹幕安全间隔
      maxNum: 10, // 缓冲队列长度
      bullets: [], // 弹幕
      last: -1, // 上一条发送的弹幕序号
      bulletStatus: [], // 0 空闲，1 占用中
      disabled: false, // 禁用中
      sending: false, // 弹幕正在发送
    };
    Object.assign(this, defaultTunnelOpt, opt);
    this.bulletStatus = new Array(this.maxNum).fill(0);
    // 初始化弹幕
    for (let i = 0; i < this.maxNum; i++) {
      this.bullets.push(
        new Bullet({
          bulletId: i,
        })
      );
    }
  }
  clear() {
    this.last = -1;
    this.sending = false;
    this.bulletStatus = new Array(this.maxNum).fill(0);
    this.bullets.forEach((bullet) => bullet.removeContent());
  }
  /**
   * 添加弹幕
   */
  addBullet(opt) {
    if (this.disabled) return;
    const idx = this.getIdleBulletIdx();
    if (idx >= 0) {
      this.bulletStatus[idx] = 1;
      this.bullets[idx].addContent(opt);
    }
  }
  /**
   * 清除弹幕
   */
  removeBullet(bulletId) {
    if (this.disabled) return;
    this.bulletStatus[bulletId] = 0;
    const bullet = this.bullets[bulletId];
    bullet.removeContent();
  }
  /**
   * 获取空闲状态的弹幕位置
   * @returns
   */
  getIdleBulletIdx() {
    return this.bulletStatus.indexOf(0);
  }
  /**
   * 获取空闲状态的总数
   * @returns
   */
  getIdleBulletNum() {
    let count = 0;
    this.bulletStatus.forEach((status) => {
      if (status === 0) count++;
    });
    return count;
  }
}

/**
 * 控制中心
 */
class Barrage {
  constructor(opt = {}) {
    this._promise = new Promise((resolve) => {
      const defaultBarrageOpt = {
        width: 300, // 弹幕区域宽度
        height: 150, // 弹幕区域高度
        duration: 10, // 弹幕动画时长
        lineHeight: 1.2, // 弹幕行高
        alpha: 1, // 全局透明度
        font: "10px sans-serif", // 全局字体
        tunnelMaxNum: 30, // 隧道最大缓冲长度
        maxLength: 30, // 弹幕最大字节长度，汉字算双字节
        safeGap: 4, // 发送时的安全间隔
        enableTap: false, // 点击弹幕停止动画高亮显示
        tunnelHeight: 0, // 轨道高度
        tunnelNum: 0, // 轨道总数
        tunnels: [], // 轨道弹幕集合
        idleTunnels: null, // 空闲轨道
        enableTunnels: null, // 可用的轨道
        distance: 2000,
        comp: null, // 组件实例
      };
      Object.assign(this, defaultBarrageOpt, opt);
      const query = this.comp.createSelectorQuery();
      query
        .select(".barrage")
        .boundingClientRect((res) => {
          // 算出实际弹幕区域
          this.width = res.width;
          this.height = res.height;
          this.init();
          resolve();
        })
        .exec();
    });
  }
  init() {
    this.fontSize = getFontSize(this.font);
    this.idleTunnels = new Set();
    this.enableTunnels = new Set();
    this.tunnels = [];
    this.availableHeight = this.height;
    this.tunnelHeight = this.fontSize * this.lineHeight;
    this.tunnelNum = Math.floor(this.availableHeight / this.tunnelHeight);
    for (let i = 0; i < this.tunnelNum; i++) {
      this.idleTunnels.add(i); // 空闲的隧道id集合
      this.enableTunnels.add(i); // 可用的隧道id集合

      this.tunnels.push(
        new Tunnel({
          // 隧道集合
          width: this.width,
          height: this.tunnelHeight,
          safeGap: this.safeGap,
          maxNum: this.tunnelMaxNum,
          tunnelId: i,
        })
      );
    }
    this.comp.setData({
      tunnels: this.tunnels,
      font: this.font,
      alpha: this.alpha,
    });
  }
  // 打开弹幕  _isActive
  open() {
    return this._promise.then(() => {
      this._isActive = true;
    });
  }
  // 关闭弹幕，清除所有数据
  close(cb) {
    return this._promise.then(() => {
      this._isActive = false;
      this.clear(cb);
    });
  }
  /**
   * 清除所有轨道数据  重置空闲集合
   * @param {*} cb
   */
  clear(cb) {
    this.tunnels.forEach((tunnel) => tunnel.clear());
    this.idleTunnels = new Set(this.enableTunnels);
    this.comp.setData({
      tunnels: this.tunnels
    }, () => {
      if (typeof cb === "function") {
        cb();
      }
    });
  }
  /**
   * 更新轨道里的弹幕信息
   */
  updateBullets() {
    const self = this;
    const query = this.comp.createSelectorQuery();
    query
      .selectAll(".barrage-item")
      .boundingClientRect((res) => {
        for (let i = 0; i < res.length; i++) {
          const {
            tunnelid,
            bulletid
          } = res[i].dataset;
          const tunnel = self.tunnels[tunnelid];
          const bullet = tunnel.bullets[bulletid];
          bullet.width = res[i].width;
          bullet.height = res[i].height;
        }
        self.animate();
      })
      .exec();
  }
  animate() {
    this.tunnels.forEach(tunnel => {
      this.tunnelAnimate(tunnel)
    })
  }

  tunnelAnimate(tunnel) {
    if (tunnel.disabled || tunnel.sending) return
    const next = (tunnel.last + 1) % tunnel.maxNum
    const bullet = tunnel.bullets[next]

    if (!bullet) return

    if (bullet.content || bullet.image) {
      tunnel.sending = true
      tunnel.last = next
      const duration = this.distance * this.duration / (this.distance + bullet.width)
      const passDistance = bullet.width + tunnel.safeGap
      bullet.duration = this.mode === 'overlap' ? duration : this.duration
      // 等上一条通过右边界
      bullet.passtime = Math.ceil(passDistance * bullet.duration * 1000 / this.distance)
      this.comp.setData({
        [`tunnels[${tunnel.tunnelId}].bullets[${bullet.bulletId}]`]: bullet
      }, () => {
        setTimeout(() => {
          tunnel.sending = false
          this.tunnelAnimate(tunnel)
        }, bullet.passtime)
      })
    }
  }
  // 添加一批弹幕，轨道满时会被丢弃
  addData(data = []) {
    return this._promise.then(() => {
      if (!this._isActive) return;
      data.forEach((item) => {
        item.content = substring(item.content, this.maxLength);
        this.addBullet2Tunnel(item);
      });
      this.comp.setData({
          tunnels: this.tunnels,
        },
        () => {
          this.updateBullets();
        }
      );
    });
  }
  /**
   * 发送一条弹幕
   * @param {*} opt
   * @returns
   */
  send(opt = {}) {
    return this._promise.then(() => {
      if (this.enableTunnels.size === 0) return;
      const timer = setInterval(() => {
        const tunnel = this.getIdleTunnel();
        if (tunnel) {
          this.addData([opt]);
          clearInterval(timer);
        }
      }, 16);
    });
  }
  // 添加至轨道
  addBullet2Tunnel(opt = {}) {
    const tunnel = this.getIdleTunnel();
    if (tunnel === null) return;

    const tunnelId = tunnel.tunnelId;
    tunnel.addBullet(opt);
    if (tunnel.getIdleBulletNum() === 0) this.removeIdleTunnel(tunnelId);
  }
  /**
   * 获取随机空闲的轨道
   */
  getIdleTunnel() {
    if (this.idleTunnels.size === 0) return null;
    const idleTunnels = Array.from(this.idleTunnels);
    const index = getRandom(idleTunnels.length);
    return this.tunnels[idleTunnels[index]];
  }
  /**
   * 添加空闲轨道集合
   */
  addIdleTunnel(tunnelId) {
    this.idleTunnels.add(tunnelId);
  }
  /**
   * 删除空闲轨道集合
   * @param {*} tunnelId
   */
  removeIdleTunnel(tunnelId) {
    this.idleTunnels.delete(tunnelId);
  }
  /**
   * 点击轨道事件
   */
  tapBullet(opt) {
    if (!this.enableTap) return;
    const {
      tunnelId,
      bulletId
    } = opt;
    const tunnel = this.tunnels[tunnelId];
    const bullet = tunnel.bullets[bulletId];
    bullet.paused = !bullet.paused;
    this.comp.setData({
      [`tunnels[${tunnelId}].bullets[${bulletId}]`]: bullet,
    });
  }
  /**
   * 动画结束事件
   */
  animationend(opt) {
    const {
      tunnelId,
      bulletId
    } = opt;
    const tunnel = this.tunnels[tunnelId];
    const bullet = tunnel.bullets[bulletId];

    if (!tunnel || !bullet) return;

    tunnel.removeBullet(bulletId);
    this.addIdleTunnel(tunnelId);
    this.comp.setData({
      [`tunnels[${tunnelId}].bullets[${bulletId}]`]: bullet,
    });
  }
}

export default Barrage;
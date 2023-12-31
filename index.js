const VERSION = '1.0.19';
class ESMainView {
	constructor() {
		this.url = location.href;
	}
	build() {
		const frame = ViewUtil.add(null, 'div', {}, { margin: '10px' });
		const body = document.getElementsByTagName('body')[0];
		body.appendChild(frame);
		//----------------------------------------------------------------------------------------
		ViewUtil.add(frame, 'h4', { text: 'Version:' + VERSION }, { margin: '5px 0px 2px 0px' });
		ViewUtil.add(frame, 'hr');
		const form = ViewUtil.add(frame, 'form', { action: './', method: 'GET', onsubmit: 'return false;' });
		const rowCurl = ViewUtil.add(form, 'div', {}, { margin: '10px' });
		////URL
		const colCurl01 = ViewUtil.add(rowCurl, 'div', {}, { margin: '1px' });
		ViewUtil.add(colCurl01, 'h4', { text: 'URL length ' }, { margin: '5px 0px 2px 0px' });
		const colCurl02 = ViewUtil.add(rowCurl, 'div', {}, { margin: '1px' });
		const inputCount = ViewUtil.add(
			colCurl02,
			'input',
			{ name: 'inputUrl', type: 'number' },
			{ margin: '5px', width: '10em' }
		);
		//////////////////////////
		const colCurl03 = ViewUtil.add(rowCurl, 'div', {}, { margin: '1px' });
		ViewUtil.add(colCurl03, 'h4', { text: 'Bookmarklet input ' }, { margin: '5px 0px 2px 0px' });
		const colCurl04 = ViewUtil.add(rowCurl, 'div', {}, { margin: '1px' });
		const textareaBookMarklet = ViewUtil.add(
			colCurl04,
			'textarea',
			{ value: '' },
			{ margin: '5px 0px 2px 0px', height: '20wh', width: '90vw' }
		);
		const rowC = ViewUtil.add(form, 'div', {}, { margin: '1px 10px' });
		ViewUtil.add(rowC, 'h4', { text: 'start' }, { margin: '5px 0px 2px 0px' });
		const colC1 = ViewUtil.add(rowC, 'div', {}, { margin: '1px 10px' });
		const buttonOpenNewTab = ViewUtil.add(colC1, 'button', { text: 'openNewWindow' }, { margin: '1px' });
		const buttonTestStart = ViewUtil.add(
			colC1,
			'button',
			{ text: 'START' },
			{ margin: '1px', padding: '2px 10px', border: '#000 solid 1px', 'border-radius': '3px', cursor: 'pointer' }
		);
		const buttonStop = ViewUtil.add(
			colC1,
			'button',
			{ text: 'STOP' },
			{ margin: '1px', padding: '2px 10px', border: '#000 solid 1px', 'border-radius': '3px', cursor: 'pointer' }
		);
		const buttonMakeLink = ViewUtil.add(
			colC1,
			'button',
			{ text: 'Make Link' },
			{ margin: '1px', padding: '2px 10px', border: '#000 solid 1px', 'border-radius': '3px', cursor: 'pointer' }
		);
		const buttonMakeBookmarklet = ViewUtil.add(
			colC1,
			'button',
			{ text: 'Make Bookmarklet' },
			{ margin: '1px', padding: '2px 10px', border: '#000 solid 1px', 'border-radius': '3px', cursor: 'pointer' }
		);
		const colC11 = ViewUtil.add(rowC, 'div', {}, { margin: '1px 20px' });
		const statusSTART = ViewUtil.add(colC11, 'span', { text: '-stop-' }, { margin: '1px', fontSize: '120%' });
		const colC12 = ViewUtil.add(rowC, 'div', {}, { margin: '1px 20px' });
		const statusLink = ViewUtil.add(
			colC12,
			'a',
			{ text: 'Link for Bookmark Making Challenge!' },
			{ margin: '1px', fontSize: '120%' }
		);
		const buttonLinkCopy = ViewUtil.add(colC12, 'button', { text: 'Copy URL' }, { margin: '1px' });
		const rowC2 = ViewUtil.add(form, 'div', {}, { margin: '10px' });
		ViewUtil.add(rowC2, 'h6', { text: 'STATUS' }, { margin: '5px 0px 2px 0px' });
		const colC2 = ViewUtil.add(rowC2, 'div', {}, { margin: '1px 10px' });
		const statusHash = ViewUtil.add(
			colC2,
			'span',
			{ text: '-NO RESULT-' },
			{ margin: '1px', fontSize: '120%', fontWeight: 'bold' }
		);
		const rowD = ViewUtil.add(frame, 'div', {}, { margin: '10px' });
		const colClog = ViewUtil.add(rowD, 'div', {}, { margin: '12px', whiteSpace: 'pre', fontSize: '60%' });
		const est = new ESTester(colClog, inputCount, statusSTART, statusHash, statusLink, textareaBookMarklet);

		ViewUtil.setOnClick(buttonOpenNewTab, async () => {
			est.openNewWindow();
		});
		ViewUtil.setOnClick(buttonTestStart, async () => {
			est.start();
		});
		ViewUtil.setOnClick(buttonStop, async () => {
			est.stop();
		});
		ViewUtil.setOnClick(buttonMakeLink, async () => {
			est.makeLink();
		});
		ViewUtil.setOnClick(buttonMakeBookmarklet, async () => {
			est.makeBookmarklet();
		});
		ViewUtil.setOnClick(buttonLinkCopy, async () => {
			est.copyLink();
		});
	}
}
const p = Math.pow(2, 32);
const u = new Uint32Array(3);
class ESTester {
	constructor(logElm, inputCounter, statusSTART, statusHash, statusLink, textareaBookMarklet) {
		this.logElm = logElm;
		this.inputCounter = inputCounter;
		this.inputCounter.value = 65533; //Upto firefox bookmark size;
		this.statusSTART = statusSTART;
		this.statusHash = statusHash;
		this.statusLink = statusLink;
		this.textareaBookMarklet = textareaBookMarklet;
		this.resolve = null;
		this.isStop = false;
		this.q = [];
		this.init();
	}
	async init() {
		this.textareaBookMarklet.value = "javascript:var a=function(){alert('hello!');};a();";
		try {
			if (this.isChild()) {
				const v = await this.validate();
				LocalStorageMessanger.send('ESTester', v, this);
			} else {
				LocalStorageMessanger.setOnRecieve(
					'ESTester',
					async (prefix, event) => {
						this.log('event:', event.newValue);
						if (this.resolve) {
							clearTimeout(this.timer);
							if (this.window) this.window.close();
							this.resolve(event.newValue);
						}
					},
					this
				);
				const url = location.href;
				const hash = await H.d(url);
				this.statusHash.textContent = `CURRENT url hash:${hash} / size:${url.length}`;
				this.statusLink.setAttribute('href', url);
			}
		} catch (e) {
			ef(e, 'init', this);
		}
	}
	async makeLink() {
		const current = this.inputCounter.value;
		const url = await this.buildUrl(current);
		this.log('link url length:' + current + ' /url.length:' + url.length);
		const hash = await H.d(url);
		this.statusHash.textContent = `LINK MAKED! CURRENT url hash:${hash} / size:${url.length}`;
		this.statusLink.setAttribute('href', url);
	}
	async openNewWindow(url = location.href) {
		const name = 'newOne' + Date.now();
		const len = url.length;
		try {
			this.log(`name:${name} len:${len} url:${url}`);
			this.window = window.open(url, name);
			this.window.isChild = true;
			this.timer = st(() => {
				this.window.close();
			}, 10000);
		} catch (e) {
			ef(e, name, this);
			if (this.resolve) {
				clearTimeout(this.timer);
				if (this.window) this.window.close();
				this.resolve(JSON.stringify({ hash: null, length: len }));
			}
		}
		return name;
	}
	async closeWindow() {
		this.window.close();
	}
	log(text, value) {
		this.q.push({ text, value, now: Date.now() });
		ct(this.logTimer);
		this.logTimer = st(() => {
			if (this.logElm) {
				if (this.isLocked) {
					return;
				}
				this.isLocked = true;
				st(() => {
					this.isLocked = false;
				}, 10000);
				const m = 100;
				const lf = '\n';
				const t = this.logElm.textContent;
				const r = t ? t.split(lf) : [];
				const n = r.length > m ? r.slice(r.length - m, r.length) : r;
				const ql = this.q.length;
				for (let i = 0; i < ql; i++) {
					const { text, value, now } = this.q.shift();
					n.push(`${now} ${typeof text !== 'string' ? JSON.stringify(text) : text} ${value}`);
				}
				this.logElm.textContent = n.join(lf);
				this.isLocked = false;
			}
			console.log(`${Date.now()} ${text}`, value);
		}, 100);
	}
	async stop() {
		this.isStop = true;
	}
	async start(maxTryCount = 100) {
		this.isStop = false;
		this.statusSTART.textContent = '-NOW being measured-';
		const taretLen = this.inputCounter.value;
		let isClose = false;
		let current = taretLen;
		let lastLen = 0;
		let max = 0;
		let count = 0;
		lastLen = current;
		let url = '';
		while (isClose === false && !this.isStop) {
			let is = 'NG';
			const { charenge, result } = await this.tryOpenTheURL(current);
			this.statusHash.textContent = `charenge(length:${charenge.length}/hash:${charenge.hash}) result(length:${result.length}/hash:${result.hash})`;
			const isOK = result.hash === charenge.hash && result.length * 1 === charenge.length * 1;
			this.log(
				`count:${count}/current:${current}/${charenge.length}/isOK:${isOK}/${result.hash === charenge.hash}/${
					result.length * 1 === charenge.length * 1
				}/ ${this.statusHash.textContent}`
			);
			if (isOK) {
				const diff = current - lastLen;
				lastLen = current;
				current = current + Math.floor(diff * 1.5);
				max = charenge.length > max ? charenge.length : max;
				url = charenge.tryedUrl;
				this.statusLink.setAttribute('href', url);
				let is = 'OK';
				this.log(
					`count:${count}/current:${current}/lastLen:${lastLen}/max:${max}/is:${is} /isClose:${isClose}`
				);
			} else {
				const d1 = current - lastLen;
				const d = max ? (d1 > 0 ? (d1 > current ? current : d1) : 100) : lastLen;
				const diff = d < 0 ? Math.abs(Math.floor(current / 2)) : d;
				this.log(
					`count:${count}/current:${current}/lastLen:${lastLen}/max:${max}/is:${is} /isClose:${isClose} /diff:${diff}`
				);
				if (max > 0 && count > 0 && Math.abs(diff) < 10) {
					isClose = true;
				}
				current = current - Math.floor(diff / 2);
				await sleep(10);
			}
			count++;
			if (count > maxTryCount) isClose = true;
		}
		const prefix = this.isStop ? 'STOPED' : 'COMPLETE';
		const endMsg = `-${prefix}- ==URL length MAX:${max}byte == ua:` + navigator.userAgent;
		this.log(endMsg);
		this.statusSTART.textContent = endMsg;
	}
	async tryOpenTheURL(current) {
		const charenge = { length: 0, hash: '', tryedUrl: '' };
		const f = async (r) => {
			const url = await this.buildUrl(current);
			const hash = await H.d(url);
			charenge.tryedUrl = url;
			charenge.length = url.length;
			charenge.hash = hash;
			// this.log(`this.tryOpenTheURL A length:${current} hash:${hash} /len${url.length}`);
			this.hash = hash;
			this.resolve = r;
			await this.openNewWindow(url);
			st(() => {
				r(false);
			}, 10000);
		};
		const result = await new Promise(f);
		// this.log('this.tryOpenTheURL B result:' + result);
		// this.log('this.tryOpenTheURL C charenge:' + JSON.stringify(charenge));
		return { charenge, result: JSON.parse(result) };
	}
	async buildUrl(targetLength, isWithPrefix = true) {
		const url = location.href.split('?')[0] + '?q=#';
		const baseLen = isWithPrefix ? url.length : 0;
		const targetLen = targetLength - baseLen;
		const count = Math.ceil(targetLen / 16);
		const a = [];
		let sum = 0,
			min = 1000,
			max = 0;
		for (let i = 0; i < count; i++) {
			u[0] = Math.ceil(Math.random() * p);
			u[1] = Math.ceil(Math.random() * p);
			u[2] = Math.ceil(Math.random() * p);
			const b = B64.a2U(u.buffer);
			a.push(b);
			const blen = b.length;
			max = max < blen ? blen : max;
			min = min > blen ? blen : min;
			sum += blen;
			if (targetLen <= sum) {
				break;
			}
		}
		const s = a.join('');
		const t = s.substring(0, targetLen);
		a.splice(0, a.length);
		this.log(`targetLen:${targetLen}/sum:${sum}/min:${min}/max:${max}/tlen:${t.length}`);
		return (isWithPrefix ? url : '') + t;
	}
	async validate() {
		const url = location.href;
		const hash = await H.d(url);
		const length = url.length;
		return { hash, length };
	}
	isChild() {
		try {
			this.log('window', window.parent);
			this.log('window.isChild:' + window.isChild);
			this.log(window.parent !== window.top);
			this.log(window.self === window.opener);
			return window.isChild;
		} catch (e) {
			return false;
		}
	}
	async makeBookmarklet() {
		const current = this.inputCounter.value;
		const js = this.textareaBookMarklet.value;
		const pureJs = js.split(/\r\n|\r|\n/g).join(' ');
		const hash1 = await H.d(pureJs);
		const target = current - pureJs.length - 4 - hash1.length;
		const urlComment = await this.buildUrl(target, false);
		this.log('link url length:' + current + ' /urlComment.length:' + urlComment.length);
		const hash = await H.d(pureJs);
		const url = `${pureJs}//${hash}//${urlComment}`;
		this.statusHash.textContent = `BOOKMARKLET MAKED! CURRENT url hash:${hash} / size:${url.length}`;
		this.statusLink.setAttribute('href', url);
	}
	async copyLink() {
		const url = this.statusLink.getAttribute('href');
		await ClipBoard.copy(url);
		alert('url copied!' + url);
	}
}

window.onload = (event) => {
	console.log(`page is fully loaded event:${event}`);
	new ESMainView().build();
};
class TextUtil {
	static convertGebavToCamel(target = '') {
		if (target) {
			const words = target.split('-');
			for (let i = 1, len = words.length; i < len; i++) {
				const word = words[i];
				const wl = word.length;
				words[i] = wl > 0 ? word.substring(0, 1).toUpperCase() : `${wl}` > 1 ? word.substring(1) : '';
			}
			return words.join('');
		} else {
			return target;
		}
	}
}
const DIV = 'div';
class ViewUtil {
	static addHiddenDiv(parent, attrs = {}) {
		return ViewUtil.add(parent, DIV, attrs, { display: 'none' });
	}
	static add(parent, tagName, attrs = {}, styles = {}) {
		const elm = document.createElement(tagName);
		for (const key in attrs) {
			if (key === 'text') continue;
			const value = attrs[key];
			elm.setAttribute(key, value);
		}
		if (attrs.text) ViewUtil.text(elm, attrs.text);
		ViewUtil.setStyles(elm, styles);
		if (parent) parent.appendChild(elm);
		return elm;
	}
	static remove(elm) {
		if (elm.parentNode) elm.parentNode.removeChild(elm);
	}
	static setStyles(elm, styles = {}) {
		for (const key in styles) {
			const value = styles[key];
			const styleKey = TextUtil.convertGebavToCamel(key);
			elm.style[styleKey] = value;
		}
	}
	static setOnClick(elm, callback) {
		return ViewUtil.setEventHandler(elm, 'click', callback);
	}
	static setOnChange(elm, callback) {
		return ViewUtil.setEventHandler(elm, 'change', callback);
	}
	static setOnInput(elm, callback) {
		return ViewUtil.setEventHandler(elm, 'input', callback);
	}
	static setEventHandler(elm, eventName, callback) {
		elm.addEventListener(eventName, callback);
		return callback;
	}
	static text(elm, newOne) {
		if (newOne) elm.textContent = newOne;
		else return elm.textContent;
	}
	static addClass(elm, className) {
		elm.classList.add(className);
	}
	static removeClass(elm, className) {
		elm.classList.remove(className);
	}
	static toggleClass(elm, className) {
		elm.classList.toggle(className);
	}
	static getBodyElm() {
		return document.getElementsByTagName('body')[0];
	}
}
const te = new TextEncoder('utf-8');
const td = new TextDecoder('utf-8');
const SlpMs = 100;
const w = (...a) => console.warn(a);
const io = (...a) => console.info(a);
const err = (...a) => console.error(a);
const now = () => Date.now();
const crv = (t) => crypto.getRandomValues(t);
const isStr = (s) => typeof s === 'string';
const isArr = (a) => Array.isArray(a);
const isFn = (s) => typeof s === 'function';
const ct = (t) => clearTimeout(t);
const st = (f, w) => setTimeout(f, w);
const ef = (e, id = '', l = null) => {
	w(`${id} ${e.message}`);
	w(e.stack);
	if (l && l.log && l !== console) {
		l.log(`${id} ${e.message}`);
		l.log(e.stack);
	}
};
function getEF(id, l) {
	return (e) => ef(e, id, l);
}
function sleep(ms = SlpMs) {
	return new Promise((r) => st(() => r(), ms));
}
const cy = crypto.subtle;
class H {
	static async d(m, sc = 1, algo = 'SHA-256', isAB = false) {
		let r = m.buffer ? (m instanceof Uint8Array ? B64.dpU8a(m) : B.u8a(m.buffer)) : te.encode(m);
		for (let i = 0; i < sc; i++) r = await cy.digest(algo, r);
		return isAB ? r : B64.a2U(r);
	}
}
class B {
	static u8a(a) {
		return new Uint8Array(a);
	}
	static u32a(a) {
		return new Uint32Array(a);
	}
	static i32a(a) {
		return new Int32Array(a);
	}
}
class B64 {
	static isSameAb(abA, abB) {
		return B64.a2B(abA) === B64.a2B(abB);
	}
	static isB64(s = '') {
		return s % 4 === 0 && /[+/=0-9a-zA-Z]+/.test(s);
	}
	static s2u(s) {
		return te.encode(s);
	}
	static u2s(u) {
		return td.decode(u);
	}
	static a2B(i) {
		return window.btoa(B64.u2b(B.u8a(i.buffer ? i.buffer : i)));
	}
	static u2B(u) {
		return window.btoa(B64.u2b(u));
	}
	static u2I(u) {
		const f = B.u8a(4);
		const l = u.length;
		const n = Math.ceil(l / 4);
		const i32a = B.i32a(n);
		for (let i = 0; i < n; i++) {
			f[0] = u[i + 0];
			f[1] = l < i + 1 ? 0 : u[i + 1];
			f[2] = l < i + 2 ? 0 : u[i + 2];
			f[3] = l < i + 3 ? 0 : u[i + 3];
			i32a[i] = B.i32a(f.buffer)[0];
		}
		return i32a;
	}
	static u8a2u32a(u) {
		const f = B.u8a(4);
		const l = u.length;
		const n = Math.ceil(l / 4);
		const u32a = B.u32a(n);
		for (let i = 0; i < n; i++) {
			f[0] = u[i + 0];
			f[1] = l < i + 1 ? 0 : u[i + 1];
			f[2] = l < i + 2 ? 0 : u[i + 2];
			f[3] = l < i + 3 ? 0 : u[i + 3];
			u32a[i] = B.u32a(f.buffer)[0];
		}
		return u32a;
	}
	static a2U(a) {
		return B64.B2U(B64.a2B(a));
	}
	static B2a(B) {
		return B64.b2u(window.atob(B));
	}
	static U2a(U) {
		return B64.B2a(B64.U2B(U));
	}
	static B2U(B) {
		return B ? B.split('+').join('-').split('/').join('_').split('=').join('') : B;
	}
	static U2B(U) {
		const l = U.length;
		const c = l % 4 > 0 ? 4 - (l % 4) : 0;
		let B = U.split('-').join('+').split('_').join('/');
		for (let i = 0; i < c; i++) B += '=';
		return B;
	}
	static jus(s) {
		let l = 0;
		const c = s.length;
		for (let i = 0; i < c; i++) l += s[i].byteLength;
		const a = B.u8a(l);
		let o = 0;
		for (let i = 0; i < c; i++) {
			const u = s[i];
			a.set(u, o);
			o += u.byteLength;
		}
		return a;
	}
	static u2b(u) {
		const r = [];
		for (const e of u) r.push(String.fromCharCode(e));
		return r.join('');
	}
	static b2u(bs) {
		const l = bs.length;
		const a = B.u8a(new ArrayBuffer(l));
		for (let i = 0; i < l; i++) a[i] = bs.charCodeAt(i);
		return a;
	}
	static L2a(b) {
		return new Promise((r) => {
			const fr = new FileReader();
			fr.onload = () => r(fr.result);
			fr.onerror = () => {
				r(fr.error);
				err(fr.error);
			};
			fr.readAsArrayBuffer(b);
		});
	}
	static dpU8a(u) {
		const l = u.length;
		const n = B.u8a(l);
		for (let i = 0; i < l; i++) n[i] = u[i];
		return n;
	}
}
class Cy {
	static async getKey(p, s) {
		const h = await H.d(B64.s2u(p).buffer, 100, 'SHA-256', true);
		const k = await cy.deriveKey(
			{
				name: 'PBKDF2',
				salt: s,
				iterations: 100000,
				hash: 'SHA-256',
			},
			await cy.importKey('raw', h, { name: 'PBKDF2' }, false, ['deriveKey']),
			{ name: 'AES-GCM', length: 256 },
			false,
			['encrypt', 'decrypt']
		);
		return [k, s];
	}
	static getSalt(saltI, isAB) {
		return saltI ? (isAB ? B.u8a(saltI) : B64.s2u(saltI)) : crv(B.u8a(16));
	}
	static async importKeyAESGCM(kAb, usages = ['encrypt', 'decrypt']) {
		return await cy.importKey('raw', kAb, { name: 'AES-GCM' }, true, usages);
	}
	static gFF() {
		return crv(B.u8a(12)); // 96bitをUint8Arrayで表すため、96 / 8 = 12が桁数となる。
	}
	static gIF() {
		return crv(B.u32a(1));
	}
	static srand() {
		return crv(B.u32a(1))[0] / 4294967295; // 0から1の間の範囲に調整するためにUInt32の最大値(2^32 -1)で割る
	}
	static async enc(s, pk) {
		return await Cy.encAES256GCM(B64.s2u(s), pk);
	}
	static async encAES256GCM(u8a, pk, saltI = null, isAB) {
		const s = Cy.getSalt(saltI, isAB);
		const fp = Cy.gFF();
		const ip = Cy.gIF();
		const iv = Uint8Array.from([...fp, ...B.u8a(ip.buffer)]);
		const edAb = await cy.encrypt({ name: 'AES-GCM', iv }, await Cy.lk(pk, s), u8a.buffer);
		return [
			B64.a2U(edAb), // 暗号化されたデータには、必ず初期ベクトルの変動部とパスワードのsaltを添付して返す。
			B64.a2U(iv.buffer),
			B64.a2U(s.buffer),
		].join(',');
	}
	static async dec(ers, pk) {
		return B64.u2s(await Cy.decAES256GCM(ers, pk));
	}
	static async lk(pk, s) {
		const [key] = isStr(pk) ? await Cy.getKey(pk, isStr(s) ? B.u8a(B64.U2a(s)) : s) : { passk: pk };
		return key;
	}
	static async decAES256GCM(ers, p) {
		const [U, ip, s] = ers.split(',');
		try {
			return B.u8a(await cy.decrypt({ name: 'AES-GCM', iv: B.u8a(B64.U2a(ip)) }, await Cy.lk(p, s), B64.U2a(U)));
		} catch (e) {
			ef(e);
			return null;
		}
	}
}
const PREFIX = '_A_';
const cache = {};
class LocalStorageMessanger {
	static send(channelPrefix, msg, logger = console) {
		logger.log('=====SEND=A=========');
		const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
		logger.log(`send prefix:"${channelPrefix}"/message:${message}`);
		const key = `${PREFIX + channelPrefix}_${Date.now()}`;
		window.localStorage.setItem(key, message);
		logger.log('=====SEND=B=========');
	}
	static setOnRecieve(
		channelPrefix,
		func = (prefix, event) => {
			console.log(prefix, event);
		},
		logger = console
	) {
		logger.log(`setOnRecieve prefix:${channelPrefix}`);
		cache.listene = (event) => {
			// logger.log(`OnRecieve prefix:${prefix} "${JSON.stringify(event)}"`);
			// logger.log(event);
			const key = event.key;
			// logger.log(`key:${key}`);
			const px = `${PREFIX + channelPrefix}_`;
			// logger.log(px);
			if (key.indexOf(px) === 0) {
				logger.log(`OnRecieve callfunc prefix:${channelPrefix}`);
				func(channelPrefix, event);
			}
		};
		window.addEventListener('storage', cache.listene);
	}
	static removeOnRecieve() {
		window.removeEventListener('storage', cache.listene);
	}
}

class ClipBoard {
	static past() {
		return navigator.clipboard.readText();
	}
	static copy(text = '<empty clipboard>') {
		return navigator.clipboard.writeText(text);
	}
}

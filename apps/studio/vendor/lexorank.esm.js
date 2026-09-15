var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoHelper.js
var require_lexoHelper = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoHelper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lexoHelper = void 0;
    exports.lexoHelper = {
      arrayCopy
    };
    function arrayCopy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
      let destination = destinationIndex;
      const finalLength = sourceIndex + length;
      for (let i = sourceIndex; i < finalLength; i++) {
        destinationArray[destination] = sourceArray[i];
        ++destination;
      }
    }
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/utils/stringBuilder.js
var require_stringBuilder = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/utils/stringBuilder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StringBuilder = class {
      constructor(str = "") {
        this.str = str;
      }
      get length() {
        return this.str.length;
      }
      set length(value) {
        this.str = this.str.substring(0, value);
      }
      append(str) {
        this.str = this.str + str;
        return this;
      }
      remove(startIndex, length) {
        this.str = this.str.substr(0, startIndex) + this.str.substr(startIndex + length);
        return this;
      }
      insert(index, value) {
        this.str = this.str.substr(0, index) + value + this.str.substr(index);
        return this;
      }
      toString() {
        return this.str;
      }
    };
    exports.default = StringBuilder;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoInteger.js
var require_lexoInteger = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoInteger.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LexoInteger = void 0;
    var lexoHelper_1 = require_lexoHelper();
    var stringBuilder_1 = require_stringBuilder();
    var LexoInteger = class _LexoInteger {
      constructor(system, sign, mag) {
        this.sys = system;
        this.sign = sign;
        this.mag = mag;
      }
      static parse(strFull, system) {
        let str = strFull;
        let sign = 1;
        if (strFull.indexOf(system.getPositiveChar()) === 0) {
          str = strFull.substring(1);
        } else if (strFull.indexOf(system.getNegativeChar()) === 0) {
          str = strFull.substring(1);
          sign = -1;
        }
        const mag = new Array(str.length);
        let strIndex = mag.length - 1;
        for (let magIndex = 0; strIndex >= 0; ++magIndex) {
          mag[magIndex] = system.toDigit(str.charAt(strIndex));
          --strIndex;
        }
        return _LexoInteger.make(system, sign, mag);
      }
      static zero(sys) {
        return new _LexoInteger(sys, 0, _LexoInteger.ZERO_MAG);
      }
      static one(sys) {
        return _LexoInteger.make(sys, 1, _LexoInteger.ONE_MAG);
      }
      static make(sys, sign, mag) {
        let actualLength;
        for (actualLength = mag.length; actualLength > 0 && mag[actualLength - 1] === 0; --actualLength) {
        }
        if (actualLength === 0) {
          return _LexoInteger.zero(sys);
        }
        if (actualLength === mag.length) {
          return new _LexoInteger(sys, sign, mag);
        }
        const nmag = new Array(actualLength).fill(0);
        lexoHelper_1.lexoHelper.arrayCopy(mag, 0, nmag, 0, actualLength);
        return new _LexoInteger(sys, sign, nmag);
      }
      static add(sys, l, r) {
        const estimatedSize = Math.max(l.length, r.length);
        const result = new Array(estimatedSize).fill(0);
        let carry = 0;
        for (let i = 0; i < estimatedSize; ++i) {
          const lnum = i < l.length ? l[i] : 0;
          const rnum = i < r.length ? r[i] : 0;
          let sum = lnum + rnum + carry;
          for (carry = 0; sum >= sys.getBase(); sum -= sys.getBase()) {
            ++carry;
          }
          result[i] = sum;
        }
        return _LexoInteger.extendWithCarry(result, carry);
      }
      static extendWithCarry(mag, carry) {
        if (carry > 0) {
          const extendedMag = new Array(mag.length + 1).fill(0);
          lexoHelper_1.lexoHelper.arrayCopy(mag, 0, extendedMag, 0, mag.length);
          extendedMag[extendedMag.length - 1] = carry;
          return extendedMag;
        }
        return mag;
      }
      static subtract(sys, l, r) {
        const rComplement = _LexoInteger.complement(sys, r, l.length);
        const rSum = _LexoInteger.add(sys, l, rComplement);
        rSum[rSum.length - 1] = 0;
        return _LexoInteger.add(sys, rSum, _LexoInteger.ONE_MAG);
      }
      static multiply(sys, l, r) {
        const result = new Array(l.length + r.length).fill(0);
        for (let li = 0; li < l.length; ++li) {
          for (let ri = 0; ri < r.length; ++ri) {
            const resultIndex = li + ri;
            for (result[resultIndex] += l[li] * r[ri]; result[resultIndex] >= sys.getBase(); result[resultIndex] -= sys.getBase()) {
              ++result[resultIndex + 1];
            }
          }
        }
        return result;
      }
      static complement(sys, mag, digits) {
        if (digits <= 0) {
          throw new Error("Expected at least 1 digit");
        }
        const nmag = new Array(digits).fill(sys.getBase() - 1);
        for (let i = 0; i < mag.length; ++i) {
          nmag[i] = sys.getBase() - 1 - mag[i];
        }
        return nmag;
      }
      static compare(l, r) {
        if (l.length < r.length) {
          return -1;
        }
        if (l.length > r.length) {
          return 1;
        }
        for (let i = l.length - 1; i >= 0; --i) {
          if (l[i] < r[i]) {
            return -1;
          }
          if (l[i] > r[i]) {
            return 1;
          }
        }
        return 0;
      }
      add(other) {
        this.checkSystem(other);
        if (this.isZero()) {
          return other;
        }
        if (other.isZero()) {
          return this;
        }
        if (this.sign !== other.sign) {
          let pos;
          if (this.sign === -1) {
            pos = this.negate();
            const val = pos.subtract(other);
            return val.negate();
          }
          pos = other.negate();
          return this.subtract(pos);
        }
        const result = _LexoInteger.add(this.sys, this.mag, other.mag);
        return _LexoInteger.make(this.sys, this.sign, result);
      }
      subtract(other) {
        this.checkSystem(other);
        if (this.isZero()) {
          return other.negate();
        }
        if (other.isZero()) {
          return this;
        }
        if (this.sign !== other.sign) {
          let negate;
          if (this.sign === -1) {
            negate = this.negate();
            const sum = negate.add(other);
            return sum.negate();
          }
          negate = other.negate();
          return this.add(negate);
        }
        const cmp = _LexoInteger.compare(this.mag, other.mag);
        if (cmp === 0) {
          return _LexoInteger.zero(this.sys);
        }
        return cmp < 0 ? _LexoInteger.make(this.sys, this.sign === -1 ? 1 : -1, _LexoInteger.subtract(this.sys, other.mag, this.mag)) : _LexoInteger.make(this.sys, this.sign === -1 ? -1 : 1, _LexoInteger.subtract(this.sys, this.mag, other.mag));
      }
      multiply(other) {
        this.checkSystem(other);
        if (this.isZero()) {
          return this;
        }
        if (other.isZero()) {
          return other;
        }
        if (this.isOneish()) {
          return this.sign === other.sign ? _LexoInteger.make(this.sys, 1, other.mag) : _LexoInteger.make(this.sys, -1, other.mag);
        }
        if (other.isOneish()) {
          return this.sign === other.sign ? _LexoInteger.make(this.sys, 1, this.mag) : _LexoInteger.make(this.sys, -1, this.mag);
        }
        const newMag = _LexoInteger.multiply(this.sys, this.mag, other.mag);
        return this.sign === other.sign ? _LexoInteger.make(this.sys, 1, newMag) : _LexoInteger.make(this.sys, -1, newMag);
      }
      negate() {
        return this.isZero() ? this : _LexoInteger.make(this.sys, this.sign === 1 ? -1 : 1, this.mag);
      }
      shiftLeft(times = 1) {
        if (times === 0) {
          return this;
        }
        if (times < 0) {
          return this.shiftRight(Math.abs(times));
        }
        const nmag = new Array(this.mag.length + times).fill(0);
        lexoHelper_1.lexoHelper.arrayCopy(this.mag, 0, nmag, times, this.mag.length);
        return _LexoInteger.make(this.sys, this.sign, nmag);
      }
      shiftRight(times = 1) {
        if (this.mag.length - times <= 0) {
          return _LexoInteger.zero(this.sys);
        }
        const nmag = new Array(this.mag.length - times).fill(0);
        lexoHelper_1.lexoHelper.arrayCopy(this.mag, times, nmag, 0, nmag.length);
        return _LexoInteger.make(this.sys, this.sign, nmag);
      }
      complement() {
        return this.complementDigits(this.mag.length);
      }
      complementDigits(digits) {
        return _LexoInteger.make(this.sys, this.sign, _LexoInteger.complement(this.sys, this.mag, digits));
      }
      isZero() {
        return this.sign === 0 && this.mag.length === 1 && this.mag[0] === 0;
      }
      isOne() {
        return this.sign === 1 && this.mag.length === 1 && this.mag[0] === 1;
      }
      getMag(index) {
        return this.mag[index];
      }
      compareTo(other) {
        if (this === other) {
          return 0;
        }
        if (!other) {
          return 1;
        }
        if (this.sign === -1) {
          if (other.sign === -1) {
            const cmp = _LexoInteger.compare(this.mag, other.mag);
            if (cmp === -1) {
              return 1;
            }
            return cmp === 1 ? -1 : 0;
          }
          return -1;
        }
        if (this.sign === 1) {
          return other.sign === 1 ? _LexoInteger.compare(this.mag, other.mag) : 1;
        }
        if (other.sign === -1) {
          return 1;
        }
        return other.sign === 1 ? -1 : 0;
      }
      getSystem() {
        return this.sys;
      }
      format() {
        if (this.isZero()) {
          return "" + this.sys.toChar(0);
        }
        const sb = new stringBuilder_1.default();
        const var2 = this.mag;
        const var3 = var2.length;
        for (let var4 = 0; var4 < var3; ++var4) {
          const digit = var2[var4];
          sb.insert(0, this.sys.toChar(digit));
        }
        if (this.sign === -1) {
          sb.insert(0, this.sys.getNegativeChar());
        }
        return sb.toString();
      }
      equals(other) {
        if (this === other) {
          return true;
        }
        if (!other) {
          return false;
        }
        return this.sys.getBase() === other.sys.getBase() && this.compareTo(other) === 0;
      }
      toString() {
        return this.format();
      }
      isOneish() {
        return this.mag.length === 1 && this.mag[0] === 1;
      }
      checkSystem(other) {
        if (this.sys.getBase() !== other.sys.getBase()) {
          throw new Error("Expected numbers of same numeral sys");
        }
      }
    };
    exports.LexoInteger = LexoInteger;
    LexoInteger.ZERO_MAG = [0];
    LexoInteger.ONE_MAG = [1];
    LexoInteger.NEGATIVE_SIGN = -1;
    LexoInteger.ZERO_SIGN = 0;
    LexoInteger.POSITIVE_SIGN = 1;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoDecimal.js
var require_lexoDecimal = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoDecimal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LexoDecimal = void 0;
    var lexoInteger_1 = require_lexoInteger();
    var stringBuilder_1 = require_stringBuilder();
    var LexoDecimal = class _LexoDecimal {
      constructor(mag, sig) {
        this.mag = mag;
        this.sig = sig;
      }
      static half(sys) {
        const mid = sys.getBase() / 2 | 0;
        return _LexoDecimal.make(lexoInteger_1.LexoInteger.make(sys, 1, [mid]), 1);
      }
      static parse(str, system) {
        const partialIndex = str.indexOf(system.getRadixPointChar());
        if (str.lastIndexOf(system.getRadixPointChar()) !== partialIndex) {
          throw new Error("More than one " + system.getRadixPointChar());
        }
        if (partialIndex < 0) {
          return _LexoDecimal.make(lexoInteger_1.LexoInteger.parse(str, system), 0);
        }
        const intStr = str.substring(0, partialIndex) + str.substring(partialIndex + 1);
        return _LexoDecimal.make(lexoInteger_1.LexoInteger.parse(intStr, system), str.length - 1 - partialIndex);
      }
      static from(integer) {
        return _LexoDecimal.make(integer, 0);
      }
      static make(integer, sig) {
        if (integer.isZero()) {
          return new _LexoDecimal(integer, 0);
        }
        let zeroCount = 0;
        for (let i = 0; i < sig && integer.getMag(i) === 0; ++i) {
          ++zeroCount;
        }
        const newInteger = integer.shiftRight(zeroCount);
        const newSig = sig - zeroCount;
        return new _LexoDecimal(newInteger, newSig);
      }
      getSystem() {
        return this.mag.getSystem();
      }
      add(other) {
        let tmag = this.mag;
        let tsig = this.sig;
        let omag = other.mag;
        let osig;
        for (osig = other.sig; tsig < osig; ++tsig) {
          tmag = tmag.shiftLeft();
        }
        while (tsig > osig) {
          omag = omag.shiftLeft();
          ++osig;
        }
        return _LexoDecimal.make(tmag.add(omag), tsig);
      }
      subtract(other) {
        let thisMag = this.mag;
        let thisSig = this.sig;
        let otherMag = other.mag;
        let otherSig;
        for (otherSig = other.sig; thisSig < otherSig; ++thisSig) {
          thisMag = thisMag.shiftLeft();
        }
        while (thisSig > otherSig) {
          otherMag = otherMag.shiftLeft();
          ++otherSig;
        }
        return _LexoDecimal.make(thisMag.subtract(otherMag), thisSig);
      }
      multiply(other) {
        return _LexoDecimal.make(this.mag.multiply(other.mag), this.sig + other.sig);
      }
      floor() {
        return this.mag.shiftRight(this.sig);
      }
      ceil() {
        if (this.isExact()) {
          return this.mag;
        }
        const floor = this.floor();
        return floor.add(lexoInteger_1.LexoInteger.one(floor.getSystem()));
      }
      isExact() {
        if (this.sig === 0) {
          return true;
        }
        for (let i = 0; i < this.sig; ++i) {
          if (this.mag.getMag(i) !== 0) {
            return false;
          }
        }
        return true;
      }
      getScale() {
        return this.sig;
      }
      setScale(nsig, ceiling = false) {
        if (nsig >= this.sig) {
          return this;
        }
        if (nsig < 0) {
          nsig = 0;
        }
        const diff = this.sig - nsig;
        let nmag = this.mag.shiftRight(diff);
        if (ceiling) {
          nmag = nmag.add(lexoInteger_1.LexoInteger.one(nmag.getSystem()));
        }
        return _LexoDecimal.make(nmag, nsig);
      }
      compareTo(other) {
        if (this === other) {
          return 0;
        }
        if (!other) {
          return 1;
        }
        let tMag = this.mag;
        let oMag = other.mag;
        if (this.sig > other.sig) {
          oMag = oMag.shiftLeft(this.sig - other.sig);
        } else if (this.sig < other.sig) {
          tMag = tMag.shiftLeft(other.sig - this.sig);
        }
        return tMag.compareTo(oMag);
      }
      format() {
        const intStr = this.mag.format();
        if (this.sig === 0) {
          return intStr;
        }
        const sb = new stringBuilder_1.default(intStr);
        const head = sb[0];
        const specialHead = head === this.mag.getSystem().getPositiveChar() || head === this.mag.getSystem().getNegativeChar();
        if (specialHead) {
          sb.remove(0, 1);
        }
        while (sb.length < this.sig + 1) {
          sb.insert(0, this.mag.getSystem().toChar(0));
        }
        sb.insert(sb.length - this.sig, this.mag.getSystem().getRadixPointChar());
        if (sb.length - this.sig === 0) {
          sb.insert(0, this.mag.getSystem().toChar(0));
        }
        if (specialHead) {
          sb.insert(0, head);
        }
        return sb.toString();
      }
      equals(other) {
        if (this === other) {
          return true;
        }
        if (!other) {
          return false;
        }
        return this.mag.equals(other.mag) && this.sig === other.sig;
      }
      toString() {
        return this.format();
      }
    };
    exports.LexoDecimal = LexoDecimal;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoRankBucket.js
var require_lexoRankBucket = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoRankBucket.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lexoInteger_1 = require_lexoInteger();
    var lexoRank_1 = require_lexoRank();
    var LexoRankBucket = class _LexoRankBucket {
      constructor(val) {
        this.value = lexoInteger_1.LexoInteger.parse(val, lexoRank_1.LexoRank.NUMERAL_SYSTEM);
      }
      static get BUCKET_0() {
        if (!this._BUCKET_0) {
          this._BUCKET_0 = new _LexoRankBucket("0");
        }
        return this._BUCKET_0;
      }
      static get BUCKET_1() {
        if (!this._BUCKET_1) {
          this._BUCKET_1 = new _LexoRankBucket("1");
        }
        return this._BUCKET_1;
      }
      static get BUCKET_2() {
        if (!this._BUCKET_2) {
          this._BUCKET_2 = new _LexoRankBucket("2");
        }
        return this._BUCKET_2;
      }
      static get VALUES() {
        if (!this._VALUES) {
          this._VALUES = [_LexoRankBucket.BUCKET_0, _LexoRankBucket.BUCKET_1, _LexoRankBucket.BUCKET_2];
        }
        return this._VALUES;
      }
      static max() {
        return _LexoRankBucket.VALUES[_LexoRankBucket.VALUES.length - 1];
      }
      static from(str) {
        const val = lexoInteger_1.LexoInteger.parse(str, lexoRank_1.LexoRank.NUMERAL_SYSTEM);
        const var2 = _LexoRankBucket.VALUES;
        const var3 = var2.length;
        for (let var4 = 0; var4 < var3; ++var4) {
          const bucket = var2[var4];
          if (bucket.value.equals(val)) {
            return bucket;
          }
        }
        throw new Error("Unknown bucket: " + str);
      }
      static resolve(bucketId) {
        const var1 = _LexoRankBucket.VALUES;
        const var2 = var1.length;
        for (let var3 = 0; var3 < var2; ++var3) {
          const bucket = var1[var3];
          if (bucket.equals(_LexoRankBucket.from(bucketId.toString()))) {
            return bucket;
          }
        }
        throw new Error("No bucket found with id " + bucketId);
      }
      format() {
        return this.value.format();
      }
      next() {
        if (this.equals(_LexoRankBucket.BUCKET_0)) {
          return _LexoRankBucket.BUCKET_1;
        }
        if (this.equals(_LexoRankBucket.BUCKET_1)) {
          return _LexoRankBucket.BUCKET_2;
        }
        return this.equals(_LexoRankBucket.BUCKET_2) ? _LexoRankBucket.BUCKET_0 : _LexoRankBucket.BUCKET_2;
      }
      prev() {
        if (this.equals(_LexoRankBucket.BUCKET_0)) {
          return _LexoRankBucket.BUCKET_2;
        }
        if (this.equals(_LexoRankBucket.BUCKET_1)) {
          return _LexoRankBucket.BUCKET_0;
        }
        return this.equals(_LexoRankBucket.BUCKET_2) ? _LexoRankBucket.BUCKET_1 : _LexoRankBucket.BUCKET_0;
      }
      equals(other) {
        if (this === other) {
          return true;
        }
        if (!other) {
          return false;
        }
        return this.value.equals(other.value);
      }
    };
    exports.default = LexoRankBucket;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem.js
var require_lexoNumeralSystem = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem10.js
var require_lexoNumeralSystem10 = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem10.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LexoNumeralSystem10 = void 0;
    var LexoNumeralSystem10 = class {
      getBase() {
        return 10;
      }
      getPositiveChar() {
        return "+";
      }
      getNegativeChar() {
        return "-";
      }
      getRadixPointChar() {
        return ".";
      }
      toDigit(ch) {
        if (ch >= "0" && ch <= "9") {
          return ch.charCodeAt(0) - 48;
        }
        throw new Error("Not valid digit: " + ch);
      }
      toChar(digit) {
        return String.fromCharCode(digit + 48);
      }
    };
    exports.LexoNumeralSystem10 = LexoNumeralSystem10;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem36.js
var require_lexoNumeralSystem36 = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem36.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LexoNumeralSystem36 = void 0;
    var LexoNumeralSystem36 = class {
      constructor() {
        this.DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
      }
      getBase() {
        return 36;
      }
      getPositiveChar() {
        return "+";
      }
      getNegativeChar() {
        return "-";
      }
      getRadixPointChar() {
        return ":";
      }
      toDigit(ch) {
        if (ch >= "0" && ch <= "9") {
          return ch.charCodeAt(0) - 48;
        }
        if (ch >= "a" && ch <= "z") {
          return ch.charCodeAt(0) - 97 + 10;
        }
        throw new Error("Not valid digit: " + ch);
      }
      toChar(digit) {
        return this.DIGITS[digit];
      }
    };
    exports.LexoNumeralSystem36 = LexoNumeralSystem36;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem64.js
var require_lexoNumeralSystem64 = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/lexoNumeralSystem64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LexoNumeralSystem64 = void 0;
    var LexoNumeralSystem64 = class {
      constructor() {
        this.DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_abcdefghijklmnopqrstuvwxyz".split("");
      }
      getBase() {
        return 64;
      }
      getPositiveChar() {
        return "+";
      }
      getNegativeChar() {
        return "-";
      }
      getRadixPointChar() {
        return ":";
      }
      toDigit(ch) {
        if (ch >= "0" && ch <= "9") {
          return ch.charCodeAt(0) - 48;
        }
        if (ch >= "A" && ch <= "Z") {
          return ch.charCodeAt(0) - 65 + 10;
        }
        if (ch === "^") {
          return 36;
        }
        if (ch === "_") {
          return 37;
        }
        if (ch >= "a" && ch <= "z") {
          return ch.charCodeAt(0) - 97 + 38;
        }
        throw new Error("Not valid digit: " + ch);
      }
      toChar(digit) {
        return this.DIGITS[digit];
      }
    };
    exports.LexoNumeralSystem64 = LexoNumeralSystem64;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/index.js
var require_numeralSystems = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/numeralSystems/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_lexoNumeralSystem(), exports);
    __exportStar(require_lexoNumeralSystem10(), exports);
    __exportStar(require_lexoNumeralSystem36(), exports);
    __exportStar(require_lexoNumeralSystem64(), exports);
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoRank.js
var require_lexoRank = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/lexoRank.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LexoRank = void 0;
    var lexoDecimal_1 = require_lexoDecimal();
    var lexoRankBucket_1 = require_lexoRankBucket();
    var stringBuilder_1 = require_stringBuilder();
    var numeralSystems_1 = require_numeralSystems();
    var LexoRank = class _LexoRank {
      constructor(bucket, decimal) {
        this.value = bucket.format() + "|" + _LexoRank.formatDecimal(decimal);
        this.bucket = bucket;
        this.decimal = decimal;
      }
      static get NUMERAL_SYSTEM() {
        if (!this._NUMERAL_SYSTEM) {
          this._NUMERAL_SYSTEM = new numeralSystems_1.LexoNumeralSystem36();
        }
        return this._NUMERAL_SYSTEM;
      }
      static get ZERO_DECIMAL() {
        if (!this._ZERO_DECIMAL) {
          this._ZERO_DECIMAL = lexoDecimal_1.LexoDecimal.parse("0", _LexoRank.NUMERAL_SYSTEM);
        }
        return this._ZERO_DECIMAL;
      }
      static get ONE_DECIMAL() {
        if (!this._ONE_DECIMAL) {
          this._ONE_DECIMAL = lexoDecimal_1.LexoDecimal.parse("1", _LexoRank.NUMERAL_SYSTEM);
        }
        return this._ONE_DECIMAL;
      }
      static get EIGHT_DECIMAL() {
        if (!this._EIGHT_DECIMAL) {
          this._EIGHT_DECIMAL = lexoDecimal_1.LexoDecimal.parse("8", _LexoRank.NUMERAL_SYSTEM);
        }
        return this._EIGHT_DECIMAL;
      }
      static get MIN_DECIMAL() {
        if (!this._MIN_DECIMAL) {
          this._MIN_DECIMAL = _LexoRank.ZERO_DECIMAL;
        }
        return this._MIN_DECIMAL;
      }
      static get MAX_DECIMAL() {
        if (!this._MAX_DECIMAL) {
          this._MAX_DECIMAL = lexoDecimal_1.LexoDecimal.parse("1000000", _LexoRank.NUMERAL_SYSTEM).subtract(_LexoRank.ONE_DECIMAL);
        }
        return this._MAX_DECIMAL;
      }
      static get MID_DECIMAL() {
        if (!this._MID_DECIMAL) {
          this._MID_DECIMAL = _LexoRank.between(_LexoRank.MIN_DECIMAL, _LexoRank.MAX_DECIMAL);
        }
        return this._MID_DECIMAL;
      }
      static get INITIAL_MIN_DECIMAL() {
        if (!this._INITIAL_MIN_DECIMAL) {
          this._INITIAL_MIN_DECIMAL = lexoDecimal_1.LexoDecimal.parse("100000", _LexoRank.NUMERAL_SYSTEM);
        }
        return this._INITIAL_MIN_DECIMAL;
      }
      static get INITIAL_MAX_DECIMAL() {
        if (!this._INITIAL_MAX_DECIMAL) {
          this._INITIAL_MAX_DECIMAL = lexoDecimal_1.LexoDecimal.parse(_LexoRank.NUMERAL_SYSTEM.toChar(_LexoRank.NUMERAL_SYSTEM.getBase() - 2) + "00000", _LexoRank.NUMERAL_SYSTEM);
        }
        return this._INITIAL_MAX_DECIMAL;
      }
      static min() {
        return _LexoRank.from(lexoRankBucket_1.default.BUCKET_0, _LexoRank.MIN_DECIMAL);
      }
      static middle() {
        const minLexoRank = _LexoRank.min();
        return minLexoRank.between(_LexoRank.max(minLexoRank.bucket));
      }
      static max(bucket = lexoRankBucket_1.default.BUCKET_0) {
        return _LexoRank.from(bucket, _LexoRank.MAX_DECIMAL);
      }
      static initial(bucket) {
        return bucket === lexoRankBucket_1.default.BUCKET_0 ? _LexoRank.from(bucket, _LexoRank.INITIAL_MIN_DECIMAL) : _LexoRank.from(bucket, _LexoRank.INITIAL_MAX_DECIMAL);
      }
      static between(oLeft, oRight) {
        if (oLeft.getSystem().getBase() !== oRight.getSystem().getBase()) {
          throw new Error("Expected same system");
        }
        let left = oLeft;
        let right = oRight;
        let nLeft;
        if (oLeft.getScale() < oRight.getScale()) {
          nLeft = oRight.setScale(oLeft.getScale(), false);
          if (oLeft.compareTo(nLeft) >= 0) {
            return _LexoRank.mid(oLeft, oRight);
          }
          right = nLeft;
        }
        if (oLeft.getScale() > right.getScale()) {
          nLeft = oLeft.setScale(right.getScale(), true);
          if (nLeft.compareTo(right) >= 0) {
            return _LexoRank.mid(oLeft, oRight);
          }
          left = nLeft;
        }
        let nRight;
        for (let scale = left.getScale(); scale > 0; right = nRight) {
          const nScale1 = scale - 1;
          const nLeft1 = left.setScale(nScale1, true);
          nRight = right.setScale(nScale1, false);
          const cmp = nLeft1.compareTo(nRight);
          if (cmp === 0) {
            return _LexoRank.checkMid(oLeft, oRight, nLeft1);
          }
          if (nLeft1.compareTo(nRight) > 0) {
            break;
          }
          scale = nScale1;
          left = nLeft1;
        }
        let mid = _LexoRank.middleInternal(oLeft, oRight, left, right);
        let nScale;
        for (let mScale = mid.getScale(); mScale > 0; mScale = nScale) {
          nScale = mScale - 1;
          const nMid = mid.setScale(nScale);
          if (oLeft.compareTo(nMid) >= 0 || nMid.compareTo(oRight) >= 0) {
            break;
          }
          mid = nMid;
        }
        return mid;
      }
      static parse(str) {
        const parts = str.split("|");
        const bucket = lexoRankBucket_1.default.from(parts[0]);
        const decimal = lexoDecimal_1.LexoDecimal.parse(parts[1], _LexoRank.NUMERAL_SYSTEM);
        return new _LexoRank(bucket, decimal);
      }
      static from(bucket, decimal) {
        if (decimal.getSystem().getBase() !== _LexoRank.NUMERAL_SYSTEM.getBase()) {
          throw new Error("Expected different system");
        }
        return new _LexoRank(bucket, decimal);
      }
      static middleInternal(lbound, rbound, left, right) {
        const mid = _LexoRank.mid(left, right);
        return _LexoRank.checkMid(lbound, rbound, mid);
      }
      static checkMid(lbound, rbound, mid) {
        if (lbound.compareTo(mid) >= 0) {
          return _LexoRank.mid(lbound, rbound);
        }
        return mid.compareTo(rbound) >= 0 ? _LexoRank.mid(lbound, rbound) : mid;
      }
      static mid(left, right) {
        const sum = left.add(right);
        const mid = sum.multiply(lexoDecimal_1.LexoDecimal.half(left.getSystem()));
        const scale = left.getScale() > right.getScale() ? left.getScale() : right.getScale();
        if (mid.getScale() > scale) {
          const roundDown = mid.setScale(scale, false);
          if (roundDown.compareTo(left) > 0) {
            return roundDown;
          }
          const roundUp = mid.setScale(scale, true);
          if (roundUp.compareTo(right) < 0) {
            return roundUp;
          }
        }
        return mid;
      }
      static formatDecimal(decimal) {
        const formatVal = decimal.format();
        const val = new stringBuilder_1.default(formatVal);
        let partialIndex = formatVal.indexOf(_LexoRank.NUMERAL_SYSTEM.getRadixPointChar());
        const zero = _LexoRank.NUMERAL_SYSTEM.toChar(0);
        if (partialIndex < 0) {
          partialIndex = formatVal.length;
          val.append(_LexoRank.NUMERAL_SYSTEM.getRadixPointChar());
        }
        while (partialIndex < 6) {
          val.insert(0, zero);
          ++partialIndex;
        }
        while (val[val.length - 1] === zero) {
          val.length = val.length - 1;
        }
        return val.toString();
      }
      genPrev() {
        if (this.isMax()) {
          return new _LexoRank(this.bucket, _LexoRank.INITIAL_MAX_DECIMAL);
        }
        const floorInteger = this.decimal.floor();
        const floorDecimal = lexoDecimal_1.LexoDecimal.from(floorInteger);
        let nextDecimal = floorDecimal.subtract(_LexoRank.EIGHT_DECIMAL);
        if (nextDecimal.compareTo(_LexoRank.MIN_DECIMAL) <= 0) {
          nextDecimal = _LexoRank.between(_LexoRank.MIN_DECIMAL, this.decimal);
        }
        return new _LexoRank(this.bucket, nextDecimal);
      }
      genNext() {
        if (this.isMin()) {
          return new _LexoRank(this.bucket, _LexoRank.INITIAL_MIN_DECIMAL);
        }
        const ceilInteger = this.decimal.ceil();
        const ceilDecimal = lexoDecimal_1.LexoDecimal.from(ceilInteger);
        let nextDecimal = ceilDecimal.add(_LexoRank.EIGHT_DECIMAL);
        if (nextDecimal.compareTo(_LexoRank.MAX_DECIMAL) >= 0) {
          nextDecimal = _LexoRank.between(this.decimal, _LexoRank.MAX_DECIMAL);
        }
        return new _LexoRank(this.bucket, nextDecimal);
      }
      between(other) {
        if (!this.bucket.equals(other.bucket)) {
          throw new Error("Between works only within the same bucket");
        }
        const cmp = this.decimal.compareTo(other.decimal);
        if (cmp > 0) {
          return new _LexoRank(this.bucket, _LexoRank.between(other.decimal, this.decimal));
        }
        if (cmp === 0) {
          throw new Error("Try to rank between issues with same rank this=" + this + " other=" + other + " this.decimal=" + this.decimal + " other.decimal=" + other.decimal);
        }
        return new _LexoRank(this.bucket, _LexoRank.between(this.decimal, other.decimal));
      }
      getBucket() {
        return this.bucket;
      }
      getDecimal() {
        return this.decimal;
      }
      inNextBucket() {
        return _LexoRank.from(this.bucket.next(), this.decimal);
      }
      inPrevBucket() {
        return _LexoRank.from(this.bucket.prev(), this.decimal);
      }
      isMin() {
        return this.decimal.equals(_LexoRank.MIN_DECIMAL);
      }
      isMax() {
        return this.decimal.equals(_LexoRank.MAX_DECIMAL);
      }
      format() {
        return this.value;
      }
      equals(other) {
        if (this === other) {
          return true;
        }
        if (!other) {
          return false;
        }
        return this.value === other.value;
      }
      toString() {
        return this.value;
      }
      compareTo(other) {
        if (this === other) {
          return 0;
        }
        if (!other) {
          return 1;
        }
        return this.value.localeCompare(other.value);
      }
    };
    exports.LexoRank = LexoRank;
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/index.js
var require_lexoRank2 = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/lexoRank/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_lexoRank(), exports);
    __exportStar(require_lexoRankBucket(), exports);
    __exportStar(require_lexoDecimal(), exports);
    __exportStar(require_lexoInteger(), exports);
  }
});

// node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/index.js
var require_index = __commonJS({
  "node_modules/.pnpm/lexorank@1.0.5/node_modules/lexorank/lib/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_lexoRank2(), exports);
    __exportStar(require_numeralSystems(), exports);
  }
});
var lexorank_default = require_index();
export default lexorank_default;
export const LexoRank = lexorank_default.LexoRank;
export const LexoDecimal = lexorank_default.LexoDecimal;
export const LexoInteger = lexorank_default.LexoInteger;
export const LexoNumeralSystem10 = lexorank_default.LexoNumeralSystem10;
export const LexoNumeralSystem36 = lexorank_default.LexoNumeralSystem36;
export const LexoNumeralSystem64 = lexorank_default.LexoNumeralSystem64;

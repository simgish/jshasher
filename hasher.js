function Hasher() {
	this._data = {};
	this.clear();
}

Hasher.prototype = {
	constructor: Hasher,

	get: function(key) {
		var h = this.hash(this.objectToStr(key));
		var entry = this._data[h];

		if (entry[0]) {
			while (true) {
				if (entry[0] === key) {
				return entry[1];
				}
				h = h + 1;

				if (!this._data[h]) return null;
			}
		}
		return null;
	},

	put: function(key, value) {
		var h = this.hash(this.objectToStr(key));
		var oldVal = this._data[h];
		while (true) {
			if (!this._data[h]) {
				this._data[h] = [key, value];
				return oldVal;
			}
			else {
				if (this._data[h][0] === key) {
					this._data[h] = [key, value];
					return oldVal;
				}
				h = h + 1;
			}
		}
	},

	containsKey: function(key) {
		var h = this.hash(this.objectToStr(key));
		var entry = this._data[h];

		if (!entry) return false;
		
		while (true) {
			if (entry[0] === key) {
				return true;
			}
			h = h + 1;

			if (!this._data[h]) return false;
		}
	},

	remove: function(key) {
		delete this._data[this.hash(key)];
	},

	getKeys: function() {
		return Object.keys(this._data);
	},

	clear: function() {
		this._data = {};
	},

	type:function(key) {
		var str = Object.prototype.toString.call(key);
		var type = str.slice(8, -1).toLowerCase();
		return type;
	},

	hash: function(key) {

    	if (typeof key !== 'string') {
    		throw key + 'is not a string'
    	}

		var h = 0;
        var len = key.length;
		
		if (h === 0 && len > 0) {
            for (var i = 0; i < len; i++) {
                h = 31*h + key.charCodeAt(i);
            }
        }
        return h;
	},

	objectToStr: function(obj) {
		if (!obj) return 0;
		if (typeof obj === 'string') return obj;

		var str = '', objkeys = Object.keys(obj);

		for (var key in objkeys) {
			str += objkeys[key] + key + '.';
		}

		return str;
	},

	forEach: function(func) {
		for (var key in this._data) {
			var data = this._data[key];
			func(data[1], data[0]);
		}
	}
}
function Hasher() {
	this._data = {};
	this.clear();
}

Hasher.prototype = {
	constructor: Hasher,

	get: function(key) {
        var h = this.hash(key);
        var entry = this._data[h];

        if(!entry)
        {
            return null;
        }

        if (entry[0]) {
            while (true) {
                if (entry[0] === key) {
                    return entry[1];
                }
                h = h + 1;
                entry = this._data[h];
                if (!entry) return null;
            }
        }
        return entry[1];
    },

    put: function(key, value) {
        var h = this.hash(key);
        var oldVal = !this._data[h] ? undefined : this._data[h][1];

        while (true) {
            if (!this._data[h]) {
                this._data[h] = [key, value];
                return oldVal;
            }
            else {
                if(this._data[h][0] === key)
                {
                    this._data[h] = [key, value];
                    return oldVal;
                }
                h = h + 1;

                oldVal = !this._data[h] ? undefined : this._data[h][1];
            }
        }
    },

    putAll: function(map)
    {
        for(var key in map)
        {
            this.put(key, map[key]);
        }
    },

    entrySet: function()
    {
        var retArray = [];
        var keys = Object.keys(this._data);
        for(var i = 0; i < keys.length; i++)
        {
            var entry = [];
            var key = keys[i];
            entry[0] = key;
            entry[1] = this._data[key];
            retArray.push(entry);
        }
        return retArray;
    },

    containsKey: function(key) {
        var h = this.hash(key);
        var entry = this._data[h];

        if (!entry) return false;

        while (true) {
            if (entry[0] === key) {
                return true;
            }
            h = h + 1;

            entry = this._data[h];
            if (!entry) return false;
        }
    },

    remove: function(key) {
        var h = this.hash(key);
        var entry = this._data[h];

        if(!entry)
        {
            return false;
        }

        if (entry[0]) {
            while (true) {
                if (entry[0] === key) {
                    delete this._data[h];
                    return true;
                }
                h = h + 1;

                entry = this._data[h];
                if (!entry) return false;
            }
        }
        delete this._data[h];
        return true;
    },

    keySet: function() {
        return Object.keys(this._data);
    },

    clear: function() {
        this._data = {};
    },

    hash: function(key) {
        key = this.objectToStr(key);

        var h = 0;
        var len = key.length;

        for (var i = 0; i < len; i++) {
            h = 31*h + key.charCodeAt(i);
            if(isNaN(h) || h === Number.POSITIVE_INFINITY || h === Number.NEGATIVE_INFINITY)
            {
                h = 0;
            }
        }
        return h % 1000000000000000;
    },

    objectToStr: function(obj) {
        if (!obj) return 'undefined';
        if (typeof obj === 'string') return obj;

        var str = '', objkeys = Object.keys(obj);

        for (var key in objkeys) {
            str += objkeys[key];
        }

        return str;
    },

    size: function()
    {
        return Object.keys(this._data).length;
    },

    isEmpty: function()
    {
        return Object.keys(this._data).length === 0;
    }
}
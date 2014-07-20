/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
/*!
* Velocity.js: Accelerated JavaScript animation.
* @version 0.2.0
* @docs http://velocityjs.org
* @license Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License
*/

!function(a,b,c,d){function e(a){for(var b=-1,c=a?a.length:0,d=[];++b<c;){var e=a[b];e&&d.push(e)}return d}function f(a){var b=q.data(a,k);return null===b?d:b}function g(a){return function(b){return Math.round(b*a)*(1/a)}}function h(a,b){var c=a;return p.isString(a)?r.Easings[a]||(c=!1):c=p.isArray(a)&&1===a.length?g.apply(null,a):p.isArray(a)&&2===a.length?t.apply(null,a.concat([b])):p.isArray(a)&&4===a.length?s.apply(null,a):!1,c===!1&&(c=r.Easings[r.defaults.easing]?r.defaults.easing:m),c}function i(a){if(a)for(var b=(new Date).getTime(),c=0,e=r.State.calls.length;e>c;c++)if(r.State.calls[c]){var g=r.State.calls[c],h=g[0],k=g[2],l=g[3];l||(l=r.State.calls[c][3]=b-16);for(var m=Math.min((b-l)/k.duration,1),n=0,q=h.length;q>n;n++){var s=h[n],t=s.element;if(f(t)){var v=!1;k.display&&"none"!==k.display&&u.setPropertyValue(t,"display",k.display);for(var w in s)if("element"!==w){var x,y=s[w],z=p.isString(y.easing)?r.Easings[y.easing]:y.easing;if(x=1===m?y.endValue:y.startValue+(y.endValue-y.startValue)*z(m),y.currentValue=x,u.Hooks.registered[w]){var A=u.Hooks.getRoot(w),B=f(t).rootPropertyValueCache[A];B&&(y.rootPropertyValue=B)}var C=u.setPropertyValue(t,w,y.currentValue+(0===parseFloat(x)?"":y.unitType),y.rootPropertyValue,y.scrollData);u.Hooks.registered[w]&&(f(t).rootPropertyValueCache[A]=u.Normalizations.registered[A]?u.Normalizations.registered[A]("extract",null,C[1]):C[1]),"transform"===C[0]&&(v=!0)}k.mobileHA&&f(t).transformCache.translate3d===d&&(f(t).transformCache.translate3d="(0px, 0px, 0px)",v=!0),v&&u.flushTransformCache(t)}}k.display&&"none"!==k.display&&(r.State.calls[c][2].display=!1),k.progress&&k.progress.call(g[1],g[1],m,Math.max(0,l+k.duration-b),l),1===m&&j(c)}r.State.isTicking&&o(i)}function j(a,b){if(!r.State.calls[a])return!1;for(var c=r.State.calls[a][0],e=r.State.calls[a][1],g=r.State.calls[a][2],h=!1,i=0,j=c.length;j>i;i++){var k=c[i].element;if(b||"none"!==g.display||g.loop||u.setPropertyValue(k,"display",g.display),(q.queue(k)[1]===d||!/\.velocityQueueEntryFlag/i.test(q.queue(k)[1]))&&f(k)){f(k).isAnimating=!1,f(k).rootPropertyValueCache={};var l,m=["transformPerspective","translateZ","rotateX","rotateY"],n=!1;for(var o in m)l=m[o],/^\(0[^.]/.test(f(k).transformCache[l])&&(n=!0,delete f(k).transformCache[l]);g.mobileHA&&(n=!0,delete f(k).transformCache.translate3d),n&&u.flushTransformCache(k)}b||!g.complete||g.loop||i!==j-1||g.complete.call(e,e),g.queue!==!1&&q.dequeue(k,g.queue)}r.State.calls[a]=!1;for(var p=0,s=r.State.calls.length;s>p;p++)if(r.State.calls[p]!==!1){h=!0;break}h===!1&&(r.State.isTicking=!1,delete r.State.calls,r.State.calls=[])}var k="velocity",l=400,m="swing",n=function(){if(c.documentMode)return c.documentMode;for(var a=7;a>4;a--){var b=c.createElement("div");if(b.innerHTML="<!--[if IE "+a+"]><span></span><![endif]-->",b.getElementsByTagName("span").length)return b=null,a}return d}(),o=b.requestAnimationFrame||function(){var a=0;return b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||function(b){var c,d=(new Date).getTime();return c=Math.max(0,16-(d-a)),a=d+c,setTimeout(function(){b(d+c)},c)}}(),p={isString:function(a){return"string"==typeof a},isArray:Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},isFunction:function(a){return"[object Function]"===Object.prototype.toString.call(a)},isNodeList:function(a){return"object"==typeof a&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(a))&&a.length!==d&&(0===a.length||"object"==typeof a[0]&&a[0].nodeType>0)},isWrapped:function(a){return a&&(a.jquery||b.Zepto&&b.Zepto.zepto.isZ(a))}},q=b.jQuery||a.Velocity&&a.Velocity.Utilities;if(!q)throw new Error("Velocity: Either jQuery or Velocity's jQuery shim must first be loaded.");if(a.Velocity!==d&&!a.Velocity.Utilities)throw new Error("Velocity: Namespace is occupied.");if(7>=n){if(b.jQuery)return void(b.jQuery.fn.velocity=b.jQuery.fn.animate);throw new Error("Velocity: For IE<=7, Velocity falls back to jQuery, which must first be loaded.")}if(8===n&&!b.jQuery)throw new Error("Velocity: For IE8, Velocity requires jQuery to be loaded. (Velocity's jQuery shim does not work with IE8.)");var r=a.Velocity=a.velocity={State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),prefixElement:c.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:b.jQuery?{}:q,Sequences:{},Easings:{},defaults:{queue:"",duration:l,easing:m,begin:null,complete:null,progress:null,display:null,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},animate:function(){},mock:!1,debug:!1};b.pageYOffset!==d?(r.State.scrollAnchor=b,r.State.scrollPropertyLeft="pageXOffset",r.State.scrollPropertyTop="pageYOffset"):(r.State.scrollAnchor=c.documentElement||c.body.parentNode||c.body,r.State.scrollPropertyLeft="scrollLeft",r.State.scrollPropertyTop="scrollTop");var s=function(){function a(a,b){return 1-3*b+3*a}function b(a,b){return 3*b-6*a}function c(a){return 3*a}function d(d,e,f){return((a(e,f)*d+b(e,f))*d+c(e))*d}function e(d,e,f){return 3*a(e,f)*d*d+2*b(e,f)*d+c(e)}return function(a,b,c,f){function g(b){for(var f=b,g=0;8>g;++g){var h=e(f,a,c);if(0===h)return f;var i=d(f,a,c)-b;f-=i/h}return f}if(4!==arguments.length)return!1;for(var h=0;4>h;++h)if("number"!=typeof arguments[h]||isNaN(arguments[h])||!isFinite(arguments[h]))return!1;return a=Math.min(a,1),c=Math.min(c,1),a=Math.max(a,0),c=Math.max(c,0),function(e){return a===b&&c===f?e:d(g(e),b,f)}}}(),t=function(){function a(a){return-a.tension*a.x-a.friction*a.v}function b(b,c,d){var e={x:b.x+d.dx*c,v:b.v+d.dv*c,tension:b.tension,friction:b.friction};return{dx:e.v,dv:a(e)}}function c(c,d){var e={dx:c.v,dv:a(c)},f=b(c,.5*d,e),g=b(c,.5*d,f),h=b(c,d,g),i=1/6*(e.dx+2*(f.dx+g.dx)+h.dx),j=1/6*(e.dv+2*(f.dv+g.dv)+h.dv);return c.x=c.x+i*d,c.v=c.v+j*d,c}return function d(a,b,e){var f,g,h,i={x:-1,v:0,tension:null,friction:null},j=[0],k=0,l=1e-4,m=.016;for(a=parseFloat(a)||600,b=parseFloat(b)||20,e=e||null,i.tension=a,i.friction=b,f=null!==e,f?(k=d(a,b),g=k/e*m):g=m;;)if(h=c(h||i,g),j.push(1+h.x),k+=16,!(Math.abs(h.x)>l&&Math.abs(h.v)>l))break;return f?function(a){return j[a*(j.length-1)|0]}:k}}();!function(){r.Easings.linear=function(a){return a},r.Easings.swing=function(a){return.5-Math.cos(a*Math.PI)/2},r.Easings.ease=s(.25,.1,.25,1),r.Easings["ease-in"]=s(.42,0,1,1),r.Easings["ease-out"]=s(0,0,.58,1),r.Easings["ease-in-out"]=s(.42,0,.58,1);var a={};q.each(["Quad","Cubic","Quart","Quint","Expo"],function(b,c){a[c]=function(a){return Math.pow(a,b+2)}}),q.extend(a,{Sine:function(a){return 1-Math.cos(a*Math.PI/2)},Circ:function(a){return 1-Math.sqrt(1-a*a)},Elastic:function(a){return 0===a||1===a?a:-Math.pow(2,8*(a-1))*Math.sin((80*(a-1)-7.5)*Math.PI/15)},Back:function(a){return a*a*(3*a-2)},Bounce:function(a){for(var b,c=4;a<((b=Math.pow(2,--c))-1)/11;);return 1/Math.pow(4,3-c)-7.5625*Math.pow((3*b-2)/22-a,2)}}),q.each(a,function(a,b){r.Easings["easeIn"+a]=b,r.Easings["easeOut"+a]=function(a){return 1-b(1-a)},r.Easings["easeInOut"+a]=function(a){return.5>a?b(2*a)/2:1-b(-2*a+2)/2}}),r.Easings.spring=function(a){return 1-Math.cos(4.5*a*Math.PI)*Math.exp(6*-a)}}();var u=r.CSS={RegEx:{valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Hooks:{templates:{color:["Red Green Blue Alpha","255 255 255 1"],backgroundColor:["Red Green Blue Alpha","255 255 255 1"],borderColor:["Red Green Blue Alpha","255 255 255 1"],borderTopColor:["Red Green Blue Alpha","255 255 255 1"],borderRightColor:["Red Green Blue Alpha","255 255 255 1"],borderBottomColor:["Red Green Blue Alpha","255 255 255 1"],borderLeftColor:["Red Green Blue Alpha","255 255 255 1"],outlineColor:["Red Green Blue Alpha","255 255 255 1"],textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0%"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){var a,b,c;if(n)for(a in u.Hooks.templates){b=u.Hooks.templates[a],c=b[0].split(" ");var d=b[1].match(u.RegEx.valueSplit);"Color"===c[0]&&(c.push(c.shift()),d.push(d.shift()),u.Hooks.templates[a]=[c.join(" "),d.join(" ")])}for(a in u.Hooks.templates){b=u.Hooks.templates[a],c=b[0].split(" ");for(var e in c){var f=a+c[e],g=e;u.Hooks.registered[f]=[a,g]}}},getRoot:function(a){var b=u.Hooks.registered[a];return b?b[0]:a},cleanRootPropertyValue:function(a,b){return u.RegEx.valueUnwrap.test(b)&&(b=b.match(u.Hooks.RegEx.valueUnwrap)[1]),u.Values.isCSSNullValue(b)&&(b=u.Hooks.templates[a][1]),b},extractValue:function(a,b){var c=u.Hooks.registered[a];if(c){var d=c[0],e=c[1];return b=u.Hooks.cleanRootPropertyValue(d,b),b.toString().match(u.RegEx.valueSplit)[e]}return b},injectValue:function(a,b,c){var d=u.Hooks.registered[a];if(d){var e,f,g=d[0],h=d[1];return c=u.Hooks.cleanRootPropertyValue(g,c),e=c.toString().match(u.RegEx.valueSplit),e[h]=b,f=e.join(" ")}return c}},Normalizations:{registered:{clip:function(a,b,c){switch(a){case"name":return"clip";case"extract":var d;return u.RegEx.wrappedValueAlreadyExtracted.test(c)?d=c:(d=c.toString().match(u.RegEx.valueUnwrap),d=d?d[1].replace(/,(\s+)?/g," "):c),d;case"inject":return"rect("+c+")"}},opacity:function(a,b,c){if(8>=n)switch(a){case"name":return"filter";case"extract":var d=c.toString().match(/alpha\(opacity=(.*)\)/i);return c=d?d[1]/100:1;case"inject":return b.style.zoom=1,parseFloat(c)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(c),10)+")"}else switch(a){case"name":return"opacity";case"extract":return c;case"inject":return c}}},register:function(){function a(a){var b,c=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,d=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;return a=a.replace(c,function(a,b,c,d){return b+b+c+c+d+d}),b=d.exec(a),b?"rgb("+(parseInt(b[1],16)+" "+parseInt(b[2],16)+" "+parseInt(b[3],16))+")":"rgb(0 0 0)"}var b=["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"];9>=n||r.State.isGingerbread||(b=b.concat(["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]));for(var c=0,e=b.length;e>c;c++)!function(){var a=b[c];u.Normalizations.registered[a]=function(b,c,e){switch(b){case"name":return"transform";case"extract":return f(c).transformCache[a]===d?/^scale/i.test(a)?1:0:f(c).transformCache[a].replace(/[()]/g,"");case"inject":var g=!1;switch(a.substr(0,a.length-1)){case"translate":g=!/(%|px|em|rem|\d)$/i.test(e);break;case"scal":case"scale":r.State.isAndroid&&f(c).transformCache[a]===d&&(e=1),g=!/(\d)$/i.test(e);break;case"skew":g=!/(deg|\d)$/i.test(e);break;case"rotate":g=!/(deg|\d)$/i.test(e)}return g||(f(c).transformCache[a]="("+e+")"),f(c).transformCache[a]}}}();for(var g=["color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],c=0,h=g.length;h>c;c++)!function(){var b=g[c];u.Normalizations.registered[b]=function(c,e,f){switch(c){case"name":return b;case"extract":var g;if(u.RegEx.wrappedValueAlreadyExtracted.test(f))g=f;else{var h,i={aqua:"rgb(0, 255, 255);",black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",fuchsia:"rgb(255, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",lime:"rgb(0, 255, 0)",maroon:"rgb(128, 0, 0)",navy:"rgb(0, 0, 128)",olive:"rgb(128, 128, 0)",purple:"rgb(128, 0, 128)",red:"rgb(255, 0, 0)",silver:"rgb(192, 192, 192)",teal:"rgb(0, 128, 128)",white:"rgb(255, 255, 255)",yellow:"rgb(255, 255, 0)"};/^[A-z]+$/i.test(f)?h=i[f]!==d?i[f]:i.black:/^#([A-f\d]{3}){1,2}$/i.test(f)?h=a(f):/^rgba?\(/i.test(f)||(h=i.black),g=(h||f).toString().match(u.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=n||3!==g.split(" ").length||(g+=" 1"),g;case"inject":return 8>=n?4===f.split(" ").length&&(f=f.split(/\s+/).slice(0,3).join(" ")):3===f.split(" ").length&&(f+=" 1"),(8>=n?"rgb":"rgba")+"("+f.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(a){return a.replace(/-(\w)/g,function(a,b){return b.toUpperCase()})},prefixCheck:function(a){if(r.State.prefixMatches[a])return[r.State.prefixMatches[a],!0];for(var b=["","Webkit","Moz","ms","O"],c=0,d=b.length;d>c;c++){var e;if(e=0===c?a:b[c]+a.replace(/^\w/,function(a){return a.toUpperCase()}),p.isString(r.State.prefixElement.style[e]))return r.State.prefixMatches[a]=e,[e,!0]}return[a,!1]}},Values:{isCSSNullValue:function(a){return 0==a||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a)},getUnitType:function(a){return/^(rotate|skew)/i.test(a)?"deg":/(^(scale|scaleX|scaleY|scaleZ|opacity|alpha|fillOpacity|flexGrow|flexHeight|zIndex|fontWeight)$)|color/i.test(a)?"":"px"},getDisplayType:function(a){var b=a.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(b)?"inline":/^(li)$/i.test(b)?"list-item":/^(tr)$/i.test(b)?"table-row":"block"}},getPropertyValue:function(a,c,e,g){function h(a,c){var e=0;if(8>=n)e=q.css(a,c);else{if(!g){if("height"===c&&"border-box"!==u.getPropertyValue(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-(parseFloat(u.getPropertyValue(a,"borderTopWidth"))||0)-(parseFloat(u.getPropertyValue(a,"borderBottomWidth"))||0)-(parseFloat(u.getPropertyValue(a,"paddingTop"))||0)-(parseFloat(u.getPropertyValue(a,"paddingBottom"))||0);if("width"===c&&"border-box"!==u.getPropertyValue(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-(parseFloat(u.getPropertyValue(a,"borderLeftWidth"))||0)-(parseFloat(u.getPropertyValue(a,"borderRightWidth"))||0)-(parseFloat(u.getPropertyValue(a,"paddingLeft"))||0)-(parseFloat(u.getPropertyValue(a,"paddingRight"))||0)}var i;i=f(a)===d?b.getComputedStyle(a,null):f(a).computedStyle?f(a).computedStyle:f(a).computedStyle=b.getComputedStyle(a,null),n&&"borderColor"===c&&(c="borderTopColor"),e=9===n&&"filter"===c?i.getPropertyValue(c):i[c],(""===e||null===e)&&(e=a.style[c])}if("auto"===e&&/^(top|right|bottom|left)$/i.test(c)){var j=h(a,"position");("fixed"===j||"absolute"===j&&/top|left/i.test(c))&&(e=q(a).position()[c]+"px")}return e}var i;if(u.Hooks.registered[c]){var j=c,k=u.Hooks.getRoot(j);e===d&&(e=u.getPropertyValue(a,u.Names.prefixCheck(k)[0])),u.Normalizations.registered[k]&&(e=u.Normalizations.registered[k]("extract",a,e)),i=u.Hooks.extractValue(j,e)}else if(u.Normalizations.registered[c]){var l,m;l=u.Normalizations.registered[c]("name",a),"transform"!==l&&(m=h(a,u.Names.prefixCheck(l)[0]),u.Values.isCSSNullValue(m)&&u.Hooks.templates[c]&&(m=u.Hooks.templates[c][1])),i=u.Normalizations.registered[c]("extract",a,m)}return/^[\d-]/.test(i)||(i=h(a,u.Names.prefixCheck(c)[0])),u.Values.isCSSNullValue(i)&&(i=0),r.debug>=2&&console.log("Get "+c+": "+i),i},setPropertyValue:function(a,c,d,e,g){var h=c;if("scroll"===c)g.container?g.container["scroll"+g.direction]=d:"Left"===g.direction?b.scrollTo(d,g.alternateValue):b.scrollTo(g.alternateValue,d);else if(u.Normalizations.registered[c]&&"transform"===u.Normalizations.registered[c]("name",a))u.Normalizations.registered[c]("inject",a,d),h="transform",d=f(a).transformCache[c];else{if(u.Hooks.registered[c]){var i=c,j=u.Hooks.getRoot(c);e=e||u.getPropertyValue(a,j),d=u.Hooks.injectValue(i,d,e),c=j}if(u.Normalizations.registered[c]&&(d=u.Normalizations.registered[c]("inject",a,d),c=u.Normalizations.registered[c]("name",a)),h=u.Names.prefixCheck(c)[0],8>=n)try{a.style[h]=d}catch(k){console.log("Error setting ["+h+"] to ["+d+"]")}else a.style[h]=d;r.debug>=2&&console.log("Set "+c+" ("+h+"): "+d)}return[h,d]},flushTransformCache:function(a){var b,c,d,e="";for(b in f(a).transformCache)c=f(a).transformCache[b],"transformPerspective"!==b?(9===n&&"rotateZ"===b&&(b="rotate"),e+=b+c+" "):d=c;d&&(e="perspective"+d+" "+e),u.setPropertyValue(a,"transform",e)}};u.Hooks.register(),u.Normalizations.register(),r.animate=function(){function a(){return g||o}function b(){function a(){function a(a){var c=d,e=d,f=d;return p.isArray(a)?(c=a[0],!p.isArray(a[1])&&/^[\d-]/.test(a[1])||p.isFunction(a[1])?f=a[1]:(p.isString(a[1])||p.isArray(a[1]))&&(e=h(a[1],g.duration),a[2]&&(f=a[2]))):c=a,e=e||g.easing,p.isFunction(c)&&(c=c.call(b,x,w)),p.isFunction(f)&&(f=f.call(b,x,w)),[c||0,e,f]}function k(a,b){var c,d;return d=(b||0).toString().toLowerCase().replace(/[%A-z]+$/,function(a){return c=a,""}),c||(c=u.Values.getUnitType(a)),[d,c]}function l(){var a={parent:b.parentNode,position:u.getPropertyValue(b,"position"),fontSize:u.getPropertyValue(b,"fontSize")},d=a.position===E.lastPosition&&a.parent===E.lastParent,e=a.fontSize===E.lastFontSize&&a.parent===E.lastParent;E.lastParent=a.parent,E.lastPosition=a.position,E.lastFontSize=a.fontSize,null===E.remToPxRatio&&(E.remToPxRatio=parseFloat(u.getPropertyValue(c.body,"fontSize"))||16);var f={overflowX:null,overflowY:null,boxSizing:null,width:null,minWidth:null,maxWidth:null,height:null,minHeight:null,maxHeight:null,paddingLeft:null},g={},h=10;if(g.remToPxRatio=E.remToPxRatio,n)var i=/^auto$/i.test(b.currentStyle.width),j=/^auto$/i.test(b.currentStyle.height);d&&e||(f.overflowX=u.getPropertyValue(b,"overflowX"),f.overflowY=u.getPropertyValue(b,"overflowY"),f.boxSizing=u.getPropertyValue(b,"boxSizing"),f.width=u.getPropertyValue(b,"width",null,!0),f.minWidth=u.getPropertyValue(b,"minWidth"),f.maxWidth=u.getPropertyValue(b,"maxWidth")||"none",f.height=u.getPropertyValue(b,"height",null,!0),f.minHeight=u.getPropertyValue(b,"minHeight"),f.maxHeight=u.getPropertyValue(b,"maxHeight")||"none",f.paddingLeft=u.getPropertyValue(b,"paddingLeft")),d?(g.percentToPxRatioWidth=E.lastPercentToPxWidth,g.percentToPxRatioHeight=E.lastPercentToPxHeight):(u.setPropertyValue(b,"overflowX","hidden"),u.setPropertyValue(b,"overflowY","hidden"),u.setPropertyValue(b,"boxSizing","content-box"),u.setPropertyValue(b,"width",h+"%"),u.setPropertyValue(b,"minWidth",h+"%"),u.setPropertyValue(b,"maxWidth",h+"%"),u.setPropertyValue(b,"height",h+"%"),u.setPropertyValue(b,"minHeight",h+"%"),u.setPropertyValue(b,"maxHeight",h+"%")),e?g.emToPxRatio=E.lastEmToPx:u.setPropertyValue(b,"paddingLeft",h+"em"),d||(g.percentToPxRatioWidth=E.lastPercentToPxWidth=(parseFloat(u.getPropertyValue(b,"width",null,!0))||1)/h,g.percentToPxRatioHeight=E.lastPercentToPxHeight=(parseFloat(u.getPropertyValue(b,"height",null,!0))||1)/h),e||(g.emToPxRatio=E.lastEmToPx=(parseFloat(u.getPropertyValue(b,"paddingLeft"))||1)/h);for(var k in f)null!==f[k]&&u.setPropertyValue(b,k,f[k]);return n?(i&&u.setPropertyValue(b,"width","auto"),j&&u.setPropertyValue(b,"height","auto")):(u.setPropertyValue(b,"height","auto"),f.height!==u.getPropertyValue(b,"height",null,!0)&&u.setPropertyValue(b,"height",f.height),u.setPropertyValue(b,"width","auto"),f.width!==u.getPropertyValue(b,"width",null,!0)&&u.setPropertyValue(b,"width",f.width)),r.debug>=1&&console.log("Unit ratios: "+JSON.stringify(g),b),g}if(g.begin&&0===x&&g.begin.call(o,o),"scroll"===A){var m,v,y,z=/^x$/i.test(g.axis)?"Left":"Top",B=parseFloat(g.offset)||0;g.container?g.container.jquery||g.container.nodeType?(g.container=g.container[0]||g.container,m=g.container["scroll"+z],y=m+q(b).position()[z.toLowerCase()]+B):g.container=null:(m=r.State.scrollAnchor[r.State["scrollProperty"+z]],v=r.State.scrollAnchor[r.State["scrollProperty"+("Left"===z?"Top":"Left")]],y=q(b).offset()[z.toLowerCase()]+B),j={scroll:{rootPropertyValue:!1,startValue:m,currentValue:m,endValue:y,unitType:"",easing:g.easing,scrollData:{container:g.container,direction:z,alternateValue:v}},element:b}}else if("reverse"===A){if(!f(b).tweensContainer)return void q.dequeue(b,g.queue);"none"===f(b).opts.display&&(f(b).opts.display="block"),f(b).opts.loop=!1,f(b).opts.begin=null,f(b).opts.complete=null,t.easing||delete g.easing,t.duration||delete g.duration,g=q.extend({},f(b).opts,g);var C=q.extend(!0,{},f(b).tweensContainer);for(var D in C)if("element"!==D){var G=C[D].startValue;C[D].startValue=C[D].currentValue=C[D].endValue,C[D].endValue=G,t&&(C[D].easing=g.easing)}j=C}else if("start"===A){var C;f(b).tweensContainer&&f(b).isAnimating===!0&&(C=f(b).tweensContainer);for(var H in s){var I=a(s[H]),J=I[0],K=I[1],L=I[2];H=u.Names.camelCase(H);var M=u.Hooks.getRoot(H),N=!1;if(u.Names.prefixCheck(M)[1]!==!1||u.Normalizations.registered[M]!==d){g.display&&"none"!==g.display&&/opacity|filter/.test(H)&&!L&&0!==J&&(L=0),g._cacheValues&&C&&C[H]?(L===d&&(L=C[H].endValue+C[H].unitType),N=f(b).rootPropertyValueCache[M]):u.Hooks.registered[H]?L===d?(N=u.getPropertyValue(b,M),L=u.getPropertyValue(b,H,N)):N=u.Hooks.templates[M][1]:L===d&&(L=u.getPropertyValue(b,H));var O,P,Q,R;O=k(H,L),L=O[0],Q=O[1],O=k(H,J),J=O[0].replace(/^([+-\/*])=/,function(a,b){return R=b,""}),P=O[1],L=parseFloat(L)||0,J=parseFloat(J)||0;var S;if("%"===P&&(/^(fontSize|lineHeight)$/.test(H)?(J/=100,P="em"):/^scale/.test(H)?(J/=100,P=""):/(Red|Green|Blue)$/i.test(H)&&(J=J/100*255,P="")),/[\/*]/.test(R))P=Q;else if(Q!==P&&0!==L)if(0===J)P=Q;else{S=S||l();var T=/margin|padding|left|right|width|text|word|letter/i.test(H)||/X$/.test(H)?"x":"y";switch(Q){case"%":L*="x"===T?S.percentToPxRatioWidth:S.percentToPxRatioHeight;break;case"em":L*=S.emToPxRatio;break;case"rem":L*=S.remToPxRatio;break;case"px":}switch(P){case"%":L*=1/("x"===T?S.percentToPxRatioWidth:S.percentToPxRatioHeight);break;case"em":L*=1/S.emToPxRatio;break;case"rem":L*=1/S.remToPxRatio;break;case"px":}}switch(R){case"+":J=L+J;break;case"-":J=L-J;break;case"*":J=L*J;break;case"/":J=L/J}j[H]={rootPropertyValue:N,startValue:L,currentValue:L,endValue:J,unitType:P,easing:K},r.debug&&console.log("tweensContainer ("+H+"): "+JSON.stringify(j[H]),b)}else r.debug&&console.log("Skipping ["+M+"] due to a lack of browser support.")}j.element=b}j.element&&(F.push(j),f(b).tweensContainer=j,f(b).opts=g,f(b).isAnimating=!0,x===w-1?(r.State.calls.length>1e4&&(r.State.calls=e(r.State.calls)),r.State.calls.push([F,o,g]),r.State.isTicking===!1&&(r.State.isTicking=!0,i())):x++)}var b=this,g=q.extend({},r.defaults,t),j={};if(f(b)===d&&q.data(b,k,{isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}}),/^\d/.test(g.delay)&&g.queue!==!1&&q.queue(b,g.queue,function(a){r.velocityQueueEntryFlag=!0,setTimeout(a,parseFloat(g.delay))}),r.mock===!0)g.duration=1;else switch(g.duration.toString().toLowerCase()){case"fast":g.duration=200;break;case"normal":g.duration=l;break;case"slow":g.duration=600;break;default:g.duration=parseFloat(g.duration)||1}g.easing=h(g.easing,g.duration),g.begin&&!p.isFunction(g.begin)&&(g.begin=null),g.progress&&!p.isFunction(g.progress)&&(g.progress=null),g.complete&&!p.isFunction(g.complete)&&(g.complete=null),g.display&&(g.display=g.display.toString().toLowerCase()),g.mobileHA=g.mobileHA&&r.State.isMobile&&!r.State.isGingerbread,g.queue===!1?g.delay?setTimeout(a,g.delay):a():q.queue(b,g.queue,function(b){r.velocityQueueEntryFlag=!0,a(b)}),""!==g.queue&&"fx"!==g.queue||"inprogress"===q.queue(b)[0]||q.dequeue(b)}var g,m,o,s,t,v=arguments[0]&&(q.isPlainObject(arguments[0].properties)&&!arguments[0].properties.names||p.isString(arguments[0].properties));if(p.isWrapped(this)?(m=0,o=this,g=this):(m=1,o=v?arguments[0].elements:arguments[0]),o=p.isWrapped(o)?[].slice.call(o):o){v?(s=arguments[0].properties,t=arguments[0].options):(s=arguments[m],t=arguments[m+1]);var w=p.isArray(o)||p.isNodeList(o)?o.length:1,x=0;if("stop"!==s&&!q.isPlainObject(t)){var y=m+1;t={};for(var z=y;z<arguments.length;z++)!p.isArray(arguments[z])&&/^\d/.test(arguments[z])?t.duration=parseFloat(arguments[z]):p.isString(arguments[z])||p.isArray(arguments[z])&&(1===arguments[z].length||2===arguments[z].length||4===arguments[z].length)?t.easing=arguments[z]:p.isFunction(arguments[z])&&(t.complete=arguments[z])}var A;switch(s){case"scroll":A="scroll";break;case"reverse":A="reverse";break;case"stop":var B=[];return q.each(r.State.calls,function(a,b){b!==!1&&q.each(b[1].nodeType?[b[1]]:b[1],function(b,c){q.each(o.nodeType?[o]:o,function(b,d){d===c&&(f(d)&&q.each(f(d).tweensContainer,function(a,b){b.endValue=b.currentValue}),(t===!0||p.isString(t))&&q.queue(d,p.isString(t)?t:"",[]),B.push(a))})})}),q.each(B,function(a,b){j(b,!0)}),a();default:if(!q.isPlainObject(s)||q.isEmptyObject(s)){if(p.isString(s)&&r.Sequences[s]){var C=o,D=t.duration;return t.backwards===!0&&(o=(o.jquery?[].slice.call(o):o).reverse()),q.each(o,function(a,b){parseFloat(t.stagger)&&(t.delay=parseFloat(t.stagger)*a),t.drag&&(t.duration=parseFloat(D)||(/^(callout|transition)/.test(s)?1e3:l),t.duration=Math.max(t.duration*(t.backwards?1-a/w:(a+1)/w),.75*t.duration,200)),r.Sequences[s].call(b,b,t||{},a,w)}),g||C}return console.log("First argument was not a property map, a known action, or a registered sequence. Aborting."),a()}A="start"}var E={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPxRatio:null},F=[];q.each(o.nodeType?[o]:o,function(a,c){c.nodeType&&b.call(c)});var G,H=q.extend({},r.defaults,t);if(H.loop=parseInt(H.loop),G=2*H.loop-1,H.loop)for(var I=0;G>I;I++){var J={delay:H.delay};H.complete&&I===G-1&&(J.complete=H.complete),r.animate(o,"reverse",J)}return a()}};var v=b.jQuery||b.Zepto;v&&(v.fn.velocity=r.animate,v.fn.velocity.defaults=r.defaults),"undefined"!=typeof define&&define.amd?define(function(){return r}):"undefined"!=typeof module&&module.exports&&(module.exports=r),q.each(["Down","Up"],function(a,b){r.Sequences["slide"+b]=function(a,c){var d=q.extend({},c),e={height:null,marginTop:null,marginBottom:null,paddingTop:null,paddingBottom:null,overflow:null,overflowX:null,overflowY:null},f=d.begin,g=d.complete,h=!1;null!==d.display&&(d.display="Down"===b?d.display||r.CSS.Values.getDisplayType(a):d.display||"none"),d.begin=function(){function c(){a.style.display="block",e.height=r.CSS.getPropertyValue(a,"height"),a.style.height="auto",r.CSS.getPropertyValue(a,"height")===e.height&&(h=!0),r.CSS.setPropertyValue(a,"height",e.height+"px")}if("Down"===b){e.overflow=[r.CSS.getPropertyValue(a,"overflow"),0],e.overflowX=[r.CSS.getPropertyValue(a,"overflowX"),0],e.overflowY=[r.CSS.getPropertyValue(a,"overflowY"),0],a.style.overflow="hidden",a.style.overflowX="visible",a.style.overflowY="hidden",c();for(var d in e)/^overflow/.test(d)||(e[d]=[r.CSS.getPropertyValue(a,d),0]);a.style.display="none"}else{c();for(var d in e)e[d]=[0,r.CSS.getPropertyValue(a,d)];a.style.overflow="hidden",a.style.overflowX="visible",a.style.overflowY="hidden"}f&&f.call(a,a)},d.complete=function(a){var c="Down"===b?0:1;h===!0?e.height[c]="auto":e.height[c]+="px";for(var d in e)a.style[d]=e[d][c];g&&g.call(a,a)},r.animate(a,e,d)}}),q.each(["In","Out"],function(a,b){r.Sequences["fade"+b]=function(a,c,d,e){var f=q.extend({},c),g={opacity:"In"===b?1:0};d!==e-1&&(f.complete=f.begin=null),null!==f.display&&(f.display="In"===b?r.CSS.Values.getDisplayType(a):"none"),r.animate(this,g,f)}})}(window.jQuery||window.Zepto||window,window,document);
/*!
 * Canvas Engine JavaScript Library 1.3.2
 * http:/canvasengine.net
 *
 * Copyright 2012, WebCreative5, Samuel Ronce
 * Licensed under the MIT.
 *
 * Date: September 14, 2012
 * Update : Mon Dec 30 12:00:44 2013
 */

var fs;if(typeof(require)!=="undefined"){fs=require("fs")}function Kernel(b,a){this.class_method=b;this.class_name=a}Kernel._extend=function(a,b,g){var f;if(!(b instanceof Array)){b=[b]}for(var e=0;e<b.length;e++){g=g===undefined?true:g;f=b[e];if(typeof f=="string"){if(Class.__class_config[f]){f=Class.__class_config[f].methods}else{return a}}if(g){f=CanvasEngine.clone(f)}for(var d in f){a[d]=f[d]}}return a};Kernel.prototype={New:function(){return this["new"].apply(this,arguments)},"new":function(){this._class=new Class();Class.__class[this.class_name]=this._class;this._construct();return this._class},_construct:function(){this._class.extend(this.class_method)},_attr_accessor:function(d,a,f){var b=this;for(var e=0;e<d.length;e++){this.class_method["_"+d[e]]=null;this.class_method[d[e]]={};if(a){this.class_method[d[e]].set=function(g){b.class_method["_"+d[e]]=g}}if(f){this.class_method[d[e]].get=function(){return b.class_method["_"+d[e]]}}}return this},attr_accessor:function(a){return this._attr_accessor(a,true,true)},attr_reader:function(a){return this._attr_accessor(a,true,false)},attr_writer:function(a){return this._attr_accessor(a,false,true)},extend:function(a,b){Kernel._extend(this.class_method,a,b);return this},addIn:function(a){if(!Class.__class[a]){return this}Class.__class[a][this.name]=this;return this}};function Class(){this.name=null}Class.__class={};Class.__class_config={};Class.get=function(a){return Class.__class[a]};Class.create=function(e,d,h){var g,b,a;Class.__class_config[e]={};Class.__class[e]={};if(h){g=window[e];tmp_class=new Class();for(var f in tmp_class){g[f]=tmp_class[f]}for(var f in d){g[f]=d[f]}b=g}else{Class.__class_config[e].methods=d;var i=Class.__class_config[e].kernel=new Kernel(Class.__class_config[e].methods,e)}return i};Class.New=function(){return Class["new"].apply(this,arguments)};Class["new"]=function(d,e,a){var b;if(typeof e=="boolean"){a=e;e=[]}if(a==undefined){a=true}e=e||[];if(!Class.__class_config[d]){throw d+' class does not exist. Use method "create" for build the structure of this class'}b=Class.__class_config[d].kernel["new"]();if(a&&b.initialize){b.initialize.apply(b,e)}b.__name__=d;return b};Class.prototype={extend:function(a,b){return Kernel._extend(this,a,b)}};var CanvasEngine={};CanvasEngine.uniqid=function(){return Math.random()};CanvasEngine.arraySplice=function(b,d){var a;for(a=0;a<d.length;++a){if(b==d[a]){d.splice(a,1);return}}};CanvasEngine.ajax=function(a){a=CanvasEngine.extend({url:"./",type:"GET",statusCode:{}},a);a.data=a.data?JSON.stringify(a.data):null;if(fs){fs.readFile("./"+a.url,"ascii",function(i,e){if(i){throw i}e=e.toString("ascii");if(a.dataType=="json"){e=CanvasEngine.parseJSON(e)}a.success(e)});return}var h;try{h=new ActiveXObject("Msxml2.XMLHTTP")}catch(f){try{h=new ActiveXObject("Microsoft.XMLHTTP")}catch(d){try{h=new XMLHttpRequest()}catch(b){h=false}}}function g(){var e;if(a.success){e=h.responseText;if(a.dataType=="json"){e=CanvasEngine.parseJSON(e)}else{if(a.dataType=="xml"){e=h.responseXML}}a.success(e)}}h.onreadystatechange=function(){if(h.readyState==4){if(a.statusCode&&a.statusCode[h.status]){a.statusCode[h.status]()}if(h.status==200){g()}else{if(a.error){a.error(h)}}}};h.open(a.type,a.url,true);if(a.mimeType){h.overrideMimeType(a.mimeType)}h.send(a.data)};CanvasEngine.getJSON=function(a,b,d){if(typeof b=="function"){d=b;b=null}CanvasEngine.ajax({url:a,dataType:"json",data:b,success:d})};CanvasEngine.parseJSON=function(a){return JSON.parse(a)};CanvasEngine.each=function(e,d){var b,a;if(!(e instanceof Array)&&!(typeof e=="number")){for(b in e){d.call(e,b,e[b])}return}if(e instanceof Array){a=e.length}else{if(typeof e=="number"){a=e;e=[]}}for(b=0;b<a;++b){d.call(e,b,e[b])}};CanvasEngine.inArray=function(b,d){var a;for(a=0;a<d.length;++a){if(b==d[a]){return a}}return -1};CanvasEngine.clone=function(a){var d;if(typeof(a)!="object"||a==null){return a}var b=a.constructor();if(b===undefined){return a}for(d in a){b[d]=CanvasEngine.clone(a[d])}return b};CanvasEngine.hexaToRGB=function(h){var f,e,a;function d(b){return(b.charAt(0)=="#")?b.substring(1,7):b}f=parseInt((d(h)).substring(0,2),16);e=parseInt((d(h)).substring(2,4),16);a=parseInt((d(h)).substring(4,6),16);return[f,e,a]};CanvasEngine.rgbToHex=function(e,d,a){return((1<<24)+(e<<16)+(d<<8)+a).toString(16).slice(1)};CanvasEngine._getRandomColorKey=function(){var e=Math.round(Math.random()*255),d=Math.round(Math.random()*255),a=Math.round(Math.random()*255);return CanvasEngine.rgbToHex(e,d,a)};CanvasEngine.random=function(b,a){return Math.floor((Math.random()*a)+b)};CanvasEngine.mobileUserAgent=function(){var a=navigator.userAgent;if(a.match(/(iPhone)/)){return"iphone"}else{if(a.match(/(iPod)/)){return"ipod"}else{if(a.match(/(iPad)/)){return"ipad"}else{if(a.match(/(BlackBerry)/)){return"blackberry"}else{if(a.match(/(Android)/)){return"android"}else{if(a.match(/(Windows Phone)/)){return"windows phone"}else{return false}}}}}}};CanvasEngine._benchmark={};CanvasEngine._interval_benchmark=60;CanvasEngine._freq_benchmark={};CanvasEngine.microtime=function(){var a=new Date().getTime()/1000;var b=parseInt(a,10);return a*1000};CanvasEngine.benchmark=function(b){var a=this.microtime();if(this._benchmark[b]){console.log("Performance "+b+" : "+(a-this._benchmark[b])+"ms")}this._benchmark[b]=a};CanvasEngine.objectSize=function(d){var b=0,a;for(a in d){if(d.hasOwnProperty(a)){b++}}return b};CanvasEngine.extend=function(b,a,d){if(!b){b={}}if(!a){a={}}return Kernel._extend(b,a,d)};if(typeof exports=="undefined"){var _ua=navigator.userAgent.toLowerCase(),_version=/(chrome|firefox|msie|version)(\/| )([0-9.]+)/.exec(_ua);CanvasEngine.browser={mozilla:/mozilla/.test(_ua)&&!/webkit/.test(_ua),webkit:/webkit/.test(_ua),opera:/opera/.test(_ua),msie:/msie/.test(_ua),version:_version?_version[3]:null,which:function(){var a;CanvasEngine.each(["mozilla","webkit","opera","msie"],function(d,b){if(CanvasEngine.browser[b]){a=b}});return{ua:a,version:CanvasEngine.browser.version}}}}CanvasEngine.moveArray=function(f,e,d){var b,a;e=parseInt(e,10);d=parseInt(d,10);if(e!==d&&0<=e&&e<=f.length&&0<=d&&d<=f.length){a=f[e];if(e<d){for(b=e;b<d;b++){f[b]=f[b+1]}}else{for(b=e;b>d;b--){f[b]=f[b-1]}}f[d]=a}return f};CanvasEngine.toTimer=function(e){var a=""+Math.floor(e/60/60),b=""+Math.floor(e/60%60),d=""+Math.floor(e%60);if(a.length==1){a="0"+a}if(b.length==1){b="0"+b}if(d.length==1){d="0"+d}return{hour:a,min:b,sec:d}};CanvasEngine.algo={pascalTriangle:function(a){a=a||10;var f=[[1,1],[1,2,1]],b=a-f.length;for(var e=f.length;e<=b;e++){f[e]=[1];for(var d=1;d<=e;d++){f[e][d]=f[e-1][d]+f[e-1][d-1]}f[e][e+1]=1}return f},};CanvasEngine.toMatrix=function(h,g,a){var d=[],b=0;for(var e=0;e<a;e++){for(var f=0;f<g;f++){if(!d[f]){d[f]=[]}d[f][e]=h[b];b++}}return d};CanvasEngine.rotateMatrix=function(g,e){var a=[],f=[];e=e||"90";if(e=="90"||e=="-90"){for(var b=0;b<g[0].length;b++){a[b]=[];for(var d=0;d<g.length;d++){a[b][d]=g[d][b]}}}if(e=="-90"){var b=0;for(var d=a.length-1;d>=0;d--){f[b]=a[d];b++}return f}if(e=="180"){for(var d=0;d<g.length;d++){a[d]=g[d].reverse()}}return a};var _CanvasEngine=CanvasEngine;if(typeof(exports)!=="undefined"){exports.Class=Class;exports.CanvasEngine=CanvasEngine}(function(){var b=0;var d=["ms","moz","webkit","o"];for(var a=0;a<d.length&&!window.requestAnimationFrame;++a){window.requestAnimationFrame=window[d[a]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[d[a]+"CancelAnimationFrame"]||window[d[a]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(i,f){var e=new Date().getTime();var g=Math.max(0,16-(e-b));var h=window.setTimeout(function(){i(e+g)},g);b=e+g;return h}}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(e){clearTimeout(e)}}}());if(typeof Element!="undefined"){var prop,vendors=["ms","moz","webkit","o","khtml"];for(var x=0;x<vendors.length&&!Element.prototype.requestFullScreen;++x){Element.prototype.requestFullScreen=Element.prototype[vendors[x]+"RequestFullScreen"];document.cancelFullScreen=document[vendors[x]+"CancelFullScreen"]}}Class.create("ModelClientClass",{create:function(b,d,a){if(!(d instanceof Array)){a=d;d=false}a.events=d;Class.create(b,a)},"new":function(b){var a=Class["new"](b).extend({_methods:{},emit:function(f,i,k){if(!i){i=[]}if(typeof i=="function"){k=i}if(k){this.on(f,k)}if(this[f]){if(!(i instanceof Array)){var h=[];for(var g in i){h.push(i[g])}i=h}var e=this[f].apply(this,i);this.call(f,e)}},on:function(e,f){if(!this._methods[e]){this._methods[e]={}}this._methods[e].callback=f},call:function(e,f){if(this._methods[e]){this._methods[e].callback(f)}}});if(this.events){for(var d in this.events){obj=a[events[d]];if(obj){obj.on(this.events[d],function(e){if(!e){e={}}obj.call(a,e)})}}}return a}});var Model=Class["new"]("ModelClientClass"),Global_CE;CanvasEngine.io=null;CanvasEngine.socketIO=function(){if(typeof(io)=="undefined"){throw"Please add socket.io - http://socket.io"}return io};CanvasEngine.User={autoAuthentication:function(g,h){CanvasEngine.socketIO();if(typeof g!="string"){h=g;g="canvasengine"}var d=new RegExp(g+"=({.*?})","i"),a=document.cookie.match(d),b;if(a&&a[1]){try{b=JSON.parse(a[1]);CanvasEngine.io.emit("_autoAuthentication",{session:b.session_id});CanvasEngine.io.on("_autoAuthentication",function(e){if(e.ret=="success"&&h.success){h.success()}else{if(e.ret=="failed"&&h.failed){h.failed(e.err)}}})}catch(f){console.warn("Error session format in cookie ; ",f.stack)}}},_setCookie:function(e,f){var b=f==undefined;e=e||"canvasengine";var d=new Date();d.setTime(d.getTime()+((b?-1:2)*24*60*60*1000));var a="; expires="+d.toGMTString();document.cookie=e+"="+(b?"":JSON.stringify(f))+a+"; path=/"},authentication:function(e,b,d){var a=this;CanvasEngine.socketIO();CanvasEngine.io.emit("_authentication",{username:e,password:b});CanvasEngine.io.on("_authentication",function(f){if(f.ret=="success"&&d.success){a._setCookie(d.cookie_name,{session_id:f.session_id});d.success()}else{if(f.ret=="failed"&&d.failed){d.failed(f.err)}}})},register:function(d,a,b){CanvasEngine.socketIO();CanvasEngine.io.emit("_register",{username:d,password:a,data:b.data});CanvasEngine.io.on("_register",function(e){if(e.ret=="success"&&b.success){b.success()}else{if(e.ret=="failed"&&b.failed){b.failed(e.err)}}})},logout:function(b){b=b||{};var a=this;CanvasEngine.socketIO();CanvasEngine.io.emit("_logout");this._setCookie(b.cookie_name)},isLogged:function(){}};CanvasEngine.connectServer=function(b,a){CanvasEngine.socketIO();CanvasEngine.io=io.connect(b+":"+a)};CanvasEngine.defines=function(a,d){d=d||{};if(d.render===undefined){d.render=true}if(typeof a=="string"){a=[a]}var b;Class.create("CanvasEngineClass",{_noConflict:false,initialize:function(e){this.canvas=a;this.el_canvas=[]},ready:function(g){var e=this;b.Sound._manager=typeof(soundManager)!=="undefined";if(b.Sound._manager){soundManager.setup(_CanvasEngine.extend({url:d.swf_sound?d.swf_sound:"swf/",onready:f},d.soundmanager))}else{if(!g){f()}else{window.onload=f}}function f(){for(var h=0;h<e.canvas.length;h++){e.el_canvas.push(e.Canvas["new"](e.canvas[h]))}if(d.render){b.Scene._loop(e.el_canvas)}if(g){g()}}return this},plugins:function(){},mouseover:false,noConflict:function(){this._noConflict=true},Materials:{images:{},_buffer:{},_cache_canvas:{},sounds:{},videos:{},fonts:{},data:{},get:function(f,e){if(e){return this[e+"s"][f]}if(_m=this.images[f]||this.sounds[f]||this.videos[f]||this.data[f]){return _m}else{if(f instanceof Image||f instanceof HTMLCanvasElement||f instanceof HTMLVideoElement||f instanceof HTMLAudioElement){return f}}if(d.ignoreLoadError){return false}throw'Cannot to get the data "'+f+'" because it does not exist'},imageToCanvas:function(m,l){l=l||{};if(this._cache_canvas[m]&&l.cache){return this._cache_canvas[m]}var g=this.get(m),i,f;if(!g){return}var e=l.width||g.width,k=l.height||g.height,i=document.createElement("canvas");i.width=e;i.height=k;f=i.getContext("2d");f.drawImage(g,0,0,g.width,g.height,0,0,e,k);this._cache_canvas[m]={canvas:i,ctx:f};return this._cache_canvas[m]},createBuffer:function(e){var g="_opaque_"+e;var f=this.get(e,"video")||e instanceof HTMLVideoElement;if(f){return f}if(!this._buffer[g]){this._buffer[g]=this.opaqueImage(e)}return this._buffer[g]},transparentColor:function(g,o,f){var e,q,t,r=this.imageToCanvas(g,{cache:f}),h=r.canvas,v=r.ctx;e=v.getImageData(0,0,h.width,h.height);q=e.data;t=_CanvasEngine.hexaToRGB(o);for(var p=0,k=q.length;p<k;p+=4){var l=q[p];var m=q[p+1];var u=q[p+2];if(l==t[0]&&m==t[1]&&u==t[2]){q[p+3]=0}}v.putImageData(e,0,0);return h},invertColor:function(n,f){var m,l,k=this.imageToCanvas(n),g=k.canvas,e=k.ctx;m=e.getImageData(0,0,g.width,g.height);l=m.data;for(var h=0;h<l.length;h+=4){l[h]=255-l[h];l[h+1]=255-l[h+1];l[h+2]=255-l[h+2]}e.putImageData(m,0,0);return g},cropImage:function(f,o,n,p,k){var e,i,m,l=this.imageToCanvas(f);if(!l){return}var g=l.canvas,q=l.ctx;e=q.getImageData(o,n,p,k);g.width=p;g.height=k;q.putImageData(e,0,0);return g},opaqueImage:function(k){var h=this.imageToCanvas(k),f=h.canvas,e=h.ctx;imageData=e.getImageData(0,0,f.width,f.height);data=imageData.data;for(var g=0;g<data.length;g+=4){if(data[g+3]>0){data[g+3]=255}}e.putImageData(imageData,0,0);return f},getExtension:function(e){return(/[.]/.exec(e))?/[^.]+$/.exec(e)[0]:undefined},getBasePath:function(g,e){var f=g.substring(0,g.lastIndexOf("/"));return f!=""&&e?f+"/":f},getFilename:function(g,e){var f=g.replace(/^.*[\\\/]/,"");if(!e){f=f.split(".")}else{return f}return f.slice(0,f.length-1).join(".")},Transition:{_data:{},set:function(n,l){var m,h,e=[];if(this._data[n]){return this._data[n]}if(!(n instanceof Array)){var k=b.Materials.imageToCanvas(n,{width:1024,height:768});if(typeof Uint8ClampedArray!="undefined"){e=new Uint8ClampedArray(k.canvas.width*k.canvas.height)}m=k.ctx.getImageData(0,0,k.canvas.width,k.canvas.height);h=m.data;var f=0;for(var g=0;g<h.length;g+=4){e[f]=h[g];f++}}else{e=l}this._data[n]=e;return e},get:function(e){return this._data[e]}},load:function(o,y,q,n){var h=0,e,v=this,u=[],w;if(!(y instanceof Array)){y=[y]}for(var g=0;g<y.length;g++){e=y[g];if(e.id){u.push(e)}else{for(var t in e){w={};w=_CanvasEngine.extend({},e[t]);if(typeof e[t]=="string"){w.path=e[t]}if(w.id){w._id=w.id}w.id=t;u.push(w);if(w.index!=undefined){_CanvasEngine.moveArray(u,u.length-1,w.index)}}}}switch(o){case"images":r();break;case"sounds":k();break;case"fonts":f();break;case"videos":m();break;case"data":l();break}function r(){var i;if(u[h]){i=new Image();i.onload=function(){var p;if(u[h].transparentcolor){p=v.transparentColor(i,u[h].transparentcolor)}if(u[h].invertcolor){p=v.invertColor(i)}else{p=i}v.images[u[h].id]=p;if(u[h].transition){v.Transition.set(u[h].id)}if(q){q.call(v,p,u[h])}h++;r()};i.onerror=function(p){if(d.ignoreLoadError){if(q){q.call(v,p)}h++;r()}};i.src=u[h].path}else{if(n){n.call(v)}}}function k(){var C;function D(){if(q){q.call(v,this,u[h])}h++;k()}if(u[h]){if(v.sounds[u[h].id]){D()}else{if(b.Sound._manager){v.sounds[u[h].id]=soundManager.createSound({id:u[h].id,url:u[h].path,autoLoad:true,autoPlay:false,onload:D,onfinish:function(){if(this._loop){this.play()}}})}else{var B=new Audio(),p=u[h].path,z=v.getBasePath(p),i=v.getFilename(p),A=v.getExtension(p);var F={mp3:B.canPlayType("audio/mpeg"),ogg:B.canPlayType('audio/ogg; codecs="vorbis"'),m4a:B.canPlayType('audio/mp4; codecs="mp4a.40.2"')};if(!F[A]){for(var E in F){if(A==E){continue}if(F[E]){p=z+"/"+i+"."+E;break}}}B.setAttribute("src",p);B.addEventListener("canplaythrough",function(){v.sounds[u[h].id]=this;D()},false);B.addEventListener("ended",function(){if(!this._loop){return}this.currentTime=0;this.play()},false);B.addEventListener("error",function(G){if(d.ignoreLoadError){D()}},false);B.load();B.pause();document.body.appendChild(B);if(/^i/.test(_CanvasEngine.mobileUserAgent())){v.sounds[u[h].id]=B;D()}}}}else{if(n){n.call(v)}}}function f(){var i=u[h];if(i){if(i.id=="google"||i.id=="ascender"||i.id=="typekit"||i.id=="monotype"||i.id=="fontdeck"){var B={};B[i.id]=i;if(i._id){B[i.id].id=i._id}if(typeof WebFontConfig=="undefined"){WebFontConfig={}}WebFontConfig=_CanvasEngine.extend(WebFontConfig,B)}else{var z=document.createElement("style");var A=v.getBasePath(i.path,true)+v.getFilename(i.path)+"."+(_CanvasEngine.browser.msie?"eot":"ttf");z.innerHTML="@font-face { font-family: '"+i.id+"'; src: url('"+A+"'); font-weight: normal; font-style: normal;}";document.getElementsByTagName("head")[0].appendChild(z)}h++;if(q){q.call(v,this,u[h])}f()}else{if(!document.getElementById("google-webfont")){var p=document.createElement("script");p.src=("https:"==document.location.protocol?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";p.type="text/javascript";p.async="true";p.id="google-webfont";var z=document.getElementsByTagName("script")[0];z.parentNode.insertBefore(p,z)}if(n){n.call(v)}}}function m(){function A(){if(q){q.call(v,this,u[h])}h++;m()}if(u[h]){var z=document.createElement("video");if(u[h].webcam){navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;function i(B){window.stream=B;if(window.URL){z.src=window.URL.createObjectURL(B)}else{z.src=B}v.videos[u[h].id]=z;A()}function p(B){throw"navigator.getUserMedia error: "+B}navigator.getUserMedia(u[h].webcam,i,p)}else{z.src=u[h].path;z.addEventListener("loadeddata",function(B){z.width=(B.srcElement||B.target).videoWidth;z.height=(B.srcElement||B.target).videoHeight;v.videos[u[h].id]=z;A()},false);z.onerror=function(B){if(d.ignoreLoadError){A()}else{throw"Video error #"+B.target.error.code+": See http://dev.w3.org/html5/spec-author-view/video.html#dom-mediaerror-media_err_aborted"}};z.load()}document.body.appendChild(z);z.setAttribute("style","display:none;")}else{if(n){n.call(v)}}}function l(){function i(){if(q){q.call(v,this,u[h])}h++;l()}if(u[h]){_CanvasEngine.ajax({url:u[h].path,dataType:"json",success:function(p){v.data[u[h].id]=p;i()},error:function(){if(d.ignoreLoadError){i()}}})}else{if(n){n.call(v)}}}}},Sound:{_fade:{},_manager:false,get:function(f){var e=b.Materials.get(f,"sound");return e},allStop:function(g){g=g||"";var e=b.Materials.sounds;for(var f in e){if(f!=g){this.stop(f)}}return this},stop:function(f){var e=this.get(f);if(d.soundmanager){e.stop()}else{e.currentTime=0;e.pause()}e._loop=false;return this},play:function(e){this.get(e).play();return this},playOnly:function(e){this.allStop(e);this.get(e).play();return this},playLoop:function(f){var e=this.get(f);e._loop=true;e.play();return this},fadeIn:function(g,e,f){this.fadeTo(g,e,1,f)},fadeOut:function(g,e,f){this.fadeTo(g,e,0,f)},fadeTo:function(k,g,i,h){var f=this.get(k),e=this._manager?f.volume/100:f.volume;this._fade[k]={sound:f,init:e,c_volume:e,f_time:g,to:i,callback:h}},_loop:function(){var g,f;for(var e in this._fade){g=this._fade[e];f=false;if(g){if(g.init<g.to){if(g.c_volume>=g.to){g.c_volume=g.to;f=true}else{g.c_volume+=(Math.abs(g.to-g.init)/g.f_time)}if(g.c_volume>0.999){g.c_volume=1}}else{if(g.c_volume<=g.to){g.c_volume=g.to;f=true}else{g.c_volume-=(Math.abs(g.to-g.init)/g.f_time)}if(g.c_volume<0.001){g.c_volume=0}}if(this._manager){g.sound.setVolume(g.c_volume*100)}else{g.sound.volume=g.c_volume}if(f){if(g.callback){g.callback.call(g.sound)}delete this._fade[e];break}}}}},Canvas:{"new":function(e){return Class["new"]("Canvas",[e])}},Element:{"new":function(h,f,g,e){return Class["new"]("Element",[h,f,g,e])}},Context:{"new":function(e){return Class["new"]("Context",[e])}},Scene:{_scenes:{},_cacheScene:{},_scenesEnabled:{},_scenesIndex:[],_scenesNbCall:{},_current:null,New:function(){return this["new"].apply(this,arguments)},"new":function(f){var e;if(typeof f=="string"){if(!this._cacheScene[f]){throw"Please initialize '"+f+"' scene with an object before"}f=this._cacheScene[f]}else{this._cacheScene[f.name]=f}e=Class["new"]("Scene",[f]).extend(f,false);this._scenesNbCall[f.name]=0;this._scenes[f.name]=e;return e},call:function(g,h){if(this._scenesNbCall[g]>0){this.New(g)}var e=this._scenes[g],f=[g];h=h||{};if(e){this._scenesEnabled[g]=e;if(this._scenesIndex.indexOf(g)==-1){if(h.transition){this._scenesIndex=f.concat(this._scenesIndex)}else{this._scenesIndex.push(g)}}if(h.exitScenes){h.exitScenes.allExcept=h.exitScenes.allExcept||[];h.exitScenes.allExcept=f.concat(h.exitScenes.allExcept);e._load.call(e,h.exitScenes,h.params)}else{if(!h.overlay&&!h.transition){this.exitAll(f)}e._load.call(e,h,h.params)}this._scenesNbCall[g]++}else{throw'Scene "'+g+"\" doesn't exist"}return e},exit:function(f){var e=this._scenesEnabled[f],h=e.getCanvas();if(e){if(h._layerDOM){h._layerDOM.innerHTML=""}e._exit.call(e);for(var g=0;g<this._scenesIndex.length;g++){if(this._scenesIndex[g]==f){this._scenesIndex.splice(g,1);break}}delete this._scenesEnabled[f]}},isEnabled:function(e){return this._scenesEnabled[e]?true:false},exitAll:function(f){var e;if(!(f instanceof Array)){f=[f]}for(e in this._scenesEnabled){if(_CanvasEngine.inArray(e,f)){this.exit(e)}}},exist:function(e){return this._scenes[e]?true:false},get:function(e){return this._scenes[e]},getEnabled:function(){return this._scenesEnabled},_loop:function(h){var f=this,g,i;this.fps=0;var l=new Date().getTime(),k;function e(){var n,m=0;k=(new Date().getTime()-l)/1000;l=new Date().getTime();f.fps=1/k;b.Sound._loop();h[m].clear();h[m]._ctxMouseEvent.clearRect(0,0,h[m].width,h[m].height);for(g=0;g<f._scenesIndex.length;g++){i=f._scenesEnabled[f._scenesIndex[g]];if(i){i._loop()}}requestAnimationFrame(e)}requestAnimationFrame(e)},getFPS:function(){return ~~this.fps},getPerformance:function(){return ~~(this.getFPS()/60*100)}}});Class.create("Canvas",{id:null,element:null,stage:null,ctx:null,_globalElements:{},_ctxTmp:null,_layerDOM:null,_layerParent:null,_ctxMouseEvent:null,_canvasMouseEvent:null,width:0,height:0,mouseEvent:true,initialize:function(f){var v=this,r,m;this.id=f;var g=this._getElementById(f);if(g.tagName!="CANVAS"&&g.tagName!="canvas"){this.element=document.createElement("canvas");this._layerDOM=document.createElement("div");r=this.element.width=g.getAttribute("width");m=this.element.height=g.getAttribute("height");this.element.style.position="absolute";g.style.position=this._layerDOM.style.position="relative";g.style.width=r+"px";g.style.height=m+"px";g.style.overflow=this._layerDOM.style.overflow="hidden";this._layerDOM.style.width=this._layerDOM.style.height="100%";g.appendChild(this.element);g.appendChild(this._layerDOM);this._layerParent=g}else{this.element=g}this.width=this.element.width;this.height=this.element.height;this.ctx=this.element.getContext("2d");this.hammerExist=typeof(Hammer)!=="undefined";this._mouseEvent();var u=["click","dbclick","mousemove","mousedown","mouseup"],q=["dragstart","drag","dragend","dragup","dragdown","dragleft","dragright","swipe","swipeup","swipedown","swipeleft","swiperight","rotate","pinch","pinchin","pinchout","tap","doubletap","hold","transformstart","transform","transformend","release","touch","release"];var p=this._layerParent||this.element;var n=null,k;if(this.hammerExist){n=new Hammer(p)}function o(h){p.addEventListener(h,function(i){t(i,h)},false)}function e(h){n.on(h,function(i){t(i,h)})}function t(C,A){var B,y,h=b.Scene.getEnabled(),w;if(C.gesture){B=C.gesture.touches}else{B=[v.getMousePosition(C)]}for(var i in h){w=h[i].getStage();for(var z=0;z<B.length;z++){k=B[z];if(k.pageX!==undefined){k=v.getMousePosition(k)}if(A=="mousemove"){if(v.mouseEvent){w._mousemove(C,k)}else{continue}}w.trigger(A,[C,k]);w._select(k,function(D){D.trigger(A,[C,k])})}}}if(n){for(var l=0;l<q.length;l++){e.call(this,q[l])}}for(var l=0;l<u.length;l++){o.call(this,u[l])}if(!d.contextmenu){p.addEventListener("contextmenu",function(h){h.preventDefault()})}},_elementsByScene:function(e,f,g){if(!this._globalElements[e]){this._globalElements[e]={}}if(!g){if(f){return this._globalElements[e][f]}return this._globalElements[e]}this._globalElements[e][f]=g},_getElementById:function(f){var e;if(d.cocoonjs){e=document.createElement("canvas");e.width=d.cocoonjs.width;e.height=d.cocoonjs.height;e.id=f;document.body.appendChild(e)}else{e=document.getElementById(f)}return e},_mouseEvent:function(){this._canvasMouseEvent=document.createElement("canvas");this._canvasMouseEvent.width=this.width;this._canvasMouseEvent.height=this.height;this._ctxMouseEvent=this._canvasMouseEvent.getContext("2d")},canvasReady:function(){},getMousePosition:function(l){var k=this.element;var i=0;var h=0;while(k&&k.tagName!="BODY"){i+=k.offsetTop;h+=k.offsetLeft;k=k.offsetParent}if(l.clientX==undefined){l.clientX=l.pageX}if(l.clientY==undefined){l.clientY=l.pageY}if(!window.pageXOffset){window.pageXOffset=0}if(!window.pageYOffset){window.pageYOffset=0}var g=l.clientX-h+window.pageXOffset;var f=l.clientY-i+window.pageYOffset;return{x:g,y:f}},measureText:function(f,e,g){var i;if(/[ ]+/.test(e)){var h=e.split(" ");e=h[0];g=h[1]}g=g||"Arial";e=e||"12px";this.ctx.font="normal "+e+" "+g;i=this.ctx.measureText(f);this.ctx.font=null;return{width:i.width,height:this._measureTextHeight(f,e,g)}},_measureTextHeight:function(h,f,k){var n=this.ctx;n.save();n.translate(0,Math.round(this.height*0.8));n.font="normal "+f+" "+k;n.fillText(h,0,0);n.restore();var g=n.getImageData(0,0,this.width,this.height).data,i=false,m=false,e=this.height,l=0;while(!m&&e){e--;for(l=0;l<this.width;l++){if(g[e*this.width*4+l*4+3]){m=e;break}}}while(e){e--;for(l=0;l<this.width;l++){if(g[e*this.width*4+l*4+3]){i=e;break}}if(i!=e){return m-i}}return 0},createPattern:function(f,e){e=e||"repeat";var g=b.Materials.get(f);if(!g){return}return this.ctx.createPattern(g,e)},createLinearGradient:function(f,h,e,g){return this.ctx.createLinearGradient(f,h,e,g)},createRadialGradient:function(h,k,g,f,i,e){return this.ctx.createRadialGradient(h,k,g,f,i,e)},addColorStop:function(f,e){return this.ctx.addColorStop(f,e)},getImageData:function(e,i,f,g){if(!e){e=0;i=0}if(!f){f=this.width;g=this.height}return this.ctx.getImageData(e,i,f,g)},putImageData:function(h,g,l,f,k,e,i){if(!g){g=0;l=0}return this.ctx.putImageData(h,g,l,f,k,e,i)},createImageData:function(){return this.ctx.createImageData.apply(this.ctx,arguments)},toDataURL:function(){return this.ctx.toDataURL()},clear:function(){return this.ctx.clearRect(0,0,this.width,this.height)},cursor:function(e){this.element.style.cursor=e},isFullscreen:function(){return document.fullscreen||document.mozFullScreen||document.webkitIsFullScreen},setSize:function(e,m,g){var i,n=this,l=this.element.width,h=this.element.height,k=e;if(e=="reset"){e=this.width=this._oldSize.width;m=this.height=this._oldSize.height;this._canvasMouseEvent.style.width=this._canvasMouseEvent.style.height=this.element.style.width=this.element.style.height=null;if(this._oldSize.type=="browser"){this.element.style.position=this.element.style.top=this.element.style.left=null}else{if(this._oldSize.type=="fullscreen"){document.cancelFullScreen()}}}else{if(e=="fullscreen"){g=m;e=screen.width;m=screen.height;if(this.element.requestFullScreen){this.element.requestFullScreen()}else{e=k="browser"}}}if(e=="browser"){g=m;e=window.innerWidth;m=window.innerHeight;var f=this.element;if(this._layerParent){f=this._layerParent}f.style.position="fixed";f.style.top=f.style.left="50%";window.onresize=function(o){if(k=="browser"){n.setSize("browser",g)}}}if(g=="fit"){i=l/h;e=m*i;this._canvasMouseEvent.style.width=this.element.style.width=e+"px";this._canvasMouseEvent.style.height=this.element.style.height=m+"px"}else{if(g=="stretch"){this._canvasMouseEvent.style.width=this.element.style.width=e+"px";this._canvasMouseEvent.style.height=this.element.style.height=m+"px"}else{this._canvasMouseEvent.width=this.width=this.element.width=e;this._canvasMouseEvent.height=this.height=this.element.height=m}}if(k=="browser"){f.style.margin=(-m/2)+"px 0 0 "+(-e/2)+"px"}if(this._layerParent){this._layerParent.style.width=e+"px";this._layerParent.style.height=m+"px"}this._oldSize={width:l,height:h,type:k};return this}});Class.create("Scene",{id:0,_stage:{},_events:[],_pause:false,_isReady:false,_index:0,model:null,initialize:function(g){var f,e=this;this.id=_CanvasEngine.uniqid();this._events=g.events},_loop:function(){if(this._pause){this._stage.refresh()}else{if(this._isReady&&this.render){this.render.call(this,this._stage)}else{this._stage.refresh()}}},emit:function(e,f){this.model.call(e,f)},getElement:function(e){if(this._global_elements[e]){return this._global_elements[e]}return this.createElement(e)},pause:function(e){if(e===undefined){return this._pause}this._pause=e;return this},togglePause:function(){return this.pause(!this._pause)},getStage:function(){return this._stage},getCanvas:function(e){if(!e){e=0}return b.el_canvas[e]},zIndex:function(f){var e;if(f===undefined){return this._index}if(f instanceof Class){f=f.zIndex()}e=b.Scene._scenesIndex.length;if(Math.abs(f)>=e){f=-1}if(f<0){f=e+f}_CanvasEngine.moveArray(b.Scene._scenesIndex,this._index,f);this._index=f;return this},createElement:function(f,k,e){if(f instanceof Array){var l={};for(var g=0;g<f.length;g++){l[f[g]]=this.createElement(f[g])}return l}if(typeof f!="string"){e=k;k=f}var h=b.Element["new"](this,null,k,e);h.name=f;return h},_exit:function(){this.getCanvas()._elementsByScene[this.name]={};if(this.exit){this.exit.call(this)}},loadEvents:function(){var e=this;if(_CanvasEngine.io&&this._events){_CanvasEngine.each(this._events,function(f,g){_CanvasEngine.io.on(e.name+"."+g,function(h){if(e[g]&&b.Scene.isEnabled(e.name)){e[g].call(e,h)}})})}},_load:function(h,v){var u=this;h=h||{};v=v||{};this._stage=b.Element["new"](this);this._stage._dom=this.getCanvas()._layerDOM;this._stage._name="__stage__";this._index=b.Scene._scenesIndex.length-1;for(var k=0;k<b.el_canvas.length;k++){b.el_canvas[k].stage=this._stage}if(this.model){if(this._events){CE.each(this._events,function(w,y){u.model.on(y,function(i){u[y].call(u,i)})})}}this.loadEvents();if(this.called){this.called(this._stage)}var n=o("images"),e=o("sounds"),g=o("fonts"),l=o("videos"),f=o("data"),r=n+e+g+l+f,m=0;if(n>0){p("images")}if(e>0){p("sounds")}if(g>0){p("fonts")}if(l>0){p("videos")}if(f>0){p("data")}if(n==0&&e==0&&g==0&&l==0&&f==0){t()}function p(i){b.Materials.load(i,u.materials[i],function(y,w){q(y,w,i)})}function q(y,w,i){m++;if(u.preload){u.preload(u._stage,m/r*100,{material:y,type:i,index:m,data:w})}if(r==m){t()}}function o(z){var y=0;if(!u.materials){return 0}if(u.materials[z]){for(var w in u.materials[z]){y++}}return y}function t(){if(h.when=="afterPreload"){b.Scene.exitAll(h.allExcept)}if(u.ready){u.ready(u._stage,v)}u._stage.trigger("canvas:readyEnd");if(u.model&&u.model.ready){u.model.ready.call(u.model)}u._isReady=true;if(h.transition){if(h.transition===true){h.transition={type:"fade"}}u.execTransition(h.transition.type,h.transition,h.overlay)}}},execTransition:function(p,l,h){var r=this,o;l=l||{};l=_CanvasEngine.extend({frames:30},l);var f=b.Scene.getEnabled(),m=0,n;for(var t in f){if(f[t].id==this.id){continue}n=f[t].getStage();o=f[t].getCanvas();switch(p){case"fade":if(!b.Timeline){throw"Add the Timeline class for transitions"}b.Timeline.New(n).to({opacity:0},l.frames).call(function(){if(!h){b.Scene.exitAll(r.name)}if(l.finish){l.finish.call(r)}f[t].zIndex(0)});break;case"image":var o=n.buffer(o.width,o.height),q=o.getContext("2d");var i=0;var g=new Worker("workers/transition.js");g.addEventListener("message",function(k){if(i==0){n.empty()}q.putImageData(k.data.imageData,0,0);n.drawImage(o);i++;if(k.data.finish){g.terminate();if(l.finish){l.finish.call(r)}if(!h){b.Scene.exitAll(r.name)}}});var e=q.getImageData(0,0,o.width,o.height);g.postMessage({imgData:e,pattern:b.Materials.Transition.get(l.id)});n.on("canvas:refresh",function(k){g.postMessage("")});m++;break}}}});Class.create("Context",{_cmd:{},_graphicCmd:[],_graphicPointer:0,img:{},_useClip:false,globalAlpha:1,_PROPS:["shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY","globalAlpha","globalCompositeOperation","lineJoin","lineCap","lineWidth","miterLimit","fillStyle","font","textBaseline","textAlign","strokeStyle"],multiple:false,alpha:function(e){},_setMethod:function(f,g){var e=this;this[f]=function(){var h=g=="cmd"?"_addCmd":"draw";e[h](f,arguments)}},_defaultRectParams:function(e,m,f,i,l,k){var g=arguments[arguments.length-1];arguments=Array.prototype.slice.call(arguments,0,arguments.length-1);if(typeof arguments[0]=="string"){this[g]=e;e=m;m=f;f=i;i=l;l=k}if(arguments[0]==undefined){e=0;m=0}if(arguments[3]==undefined){f=this.width;i=this.height}return[e,m,f,i,l]},fillRect:function(e,l,f,i,k){var g=Array.prototype.slice.call(arguments,0);g=this._defaultRectParams.apply(this,g.concat("fillStyle"));if(typeof e!="string"&&k!==undefined){this._roundRect.apply(this,g.concat("fill"));return}this._addCmd("fillRect",g,["fillStyle"]);return this},strokeRect:function(e,l,f,i,k){var g=Array.prototype.slice.call(arguments,0);g=this._defaultRectParams.apply(this,g.concat("strokeStyle"));if(typeof e!="string"&&k!==undefined){this._roundRect.apply(this,g.concat("stroke"));return this}this._addCmd("strokeRect",g,["strokeStyle"]);return this},fillCircle:function(e,g,f){this._circle(e,g,f,"fill");return this},strokeCircle:function(e,g,f){this._circle(e,g,f,"stroke");return this},_circle:function(e,h,g,f){if(h===undefined){g=e}e=e||0;h=h||0;g=g||this.width/2;if(isNaN(g)){console.warn(f+"Circle() : Impossible to define the radius of the circle. Give a width to the element")}if(!this.strokeStyle){this.strokeStyle="black"}this.beginPath();this.arc(e,h,g,0,2*Math.PI,false);this[f]()},_roundRect:function(e,l,f,i,k,g){if(f<2*k){k=f/2}if(i<2*k){k=i/2}this.beginPath();this.moveTo(e+k,l);this.arcTo(e+f,l,e+f,l+i,k);this.arcTo(e+f,l+i,e,l+i,k);this.arcTo(e,l+i,e,l,k);this.arcTo(e,l,e+f,l,k);this.closePath();this[g]()},fill:function(){this._addCmd("fill",[],["fillStyle"]);return this},fillText:function(g,e,h){if(e=="middle"&&this.width&&this.height){var f=this.scene.getCanvas().measureText(g,this.font).width;this.textBaseline="middle";e=this.width/2-f/2;h=this.height/2}if(!e){e=0}if(!h){h=0}this._addCmd("fillText",[g,e,h],["fillStyle","font","textBaseline","textAlign"]);return this},strokeText:function(f,e,g){this._addCmd("strokeText",[f,e,g],["strokeStyle","font","textBaseline","textAlign"]);return this},stroke:function(){this._addCmd("stroke",[],["strokeStyle"]);return this},drawImage:function(i,p,o,q,k,t,r,e,n){var l,f,h,m=i;if(!p){p=0}if(!o){o=0}if(typeof i==="string"){m=b.Materials.get(i);if(!m){return}this.img.width=m.width;this.img.height=m.height}if(/%$/.test(q)){t=p;r=o;p=0;o=0;q=m.width*parseInt(q)/100;k=m.height;e=q;n=k}var g=new RegExp("^"+window.location.origin,"g");if(!g.test(m.src)){h=m}else{h=b.Materials.createBuffer(i)}if(q!==undefined){if(t===undefined){l=[m,p,o,q,k];f=[h,p,o,q,k]}else{l=[m,p,o,q,k,t,r,e,n];f=[h,p,o,q,k,t,r,e,n]}this._buffer_img={params:f,x:t,y:r,width:e,height:n}}else{l=[m,p,o];f=[h,p,o];this._buffer_img={params:f,x:p,y:o,width:m.width,height:m.height}}this._addCmd("drawImage",l);return this},moveTo:function(){this._addCmd.call(this,"moveTo",arguments,true);return this},lineTo:function(){this._addCmd.call(this,"lineTo",arguments,true);return this},quadraticCurveTo:function(){this._addCmd.call(this,"quadraticCurveTo",arguments,true);return this},bezierCurveTo:function(){this._addCmd.call(this,"bezierCurveTo",arguments,true);return this},beginPath:function(){this.multiple=true;this._graphicCmd.push([]);this._addCmd.call(this,"beginPath",arguments);return this},closePath:function(){this._addCmd.call(this,"closePath",arguments,true);return this},clip:function(){this._useClip=true;this._addCmd.call(this,"clip",arguments);return this},rect:function(){var e=Array.prototype.slice.call(arguments,0);e=this._defaultRectParams.apply(this,e.concat("fillStyle"));this._addCmd("rect",e);return this},arc:function(){this._addCmd.call(this,"arc",arguments,true);return this},arcTo:function(){this._addCmd.call(this,"arcTo",arguments,true);return this},addColorStop:function(){this._addCmd.call(this,"addColorStop",arguments,true);return this},isPointInPath:function(){this._addCmd.call(this,"isPointInPath",arguments,true);return this},rotate:function(){this.draw.call(this,"rotate",arguments);return this},translate:function(){this.draw.call(this,"translate",arguments);return this},transform:function(){this.draw.call(this,"transform",arguments);return this},setTransform:function(){this.draw.call(this,"setTransform",arguments);return this},resetTransform:function(){this.draw.call(this,"resetTransform",arguments);return this},clearRect:function(){this.draw.call(this,"clearRect",arguments);return this},scale:function(){this.draw.call(this,"scale",arguments);return this},rotateDeg:function(e){this.rotate(e*Math.PI/180)},save:function(e){if(e){this._addCmd("save")}else{this.draw("save")}},restore:function(e){if(e){this._addCmd("restore")}else{this.draw("restore")}},clearPropreties:function(){var f=this._PROPS;for(var e=0;e<f.length;e++){if(this[f[e]]){this[f[e]]=undefined}}},_bufferEvent:function(f,e){var g=this._canvas[0]["_ctxMouseEvent"];if(this.hasEvent()||this._useClip){if(f=="drawImage"&&!this._forceEvent){g[f].apply(this._canvas[0]["_ctxMouseEvent"],this._buffer_img.params);g.globalCompositeOperation="source-atop";g.fillStyle="#"+this.color_key;g.fillRect(this._buffer_img.x,this._buffer_img.y,this._buffer_img.width,this._buffer_img.height)}else{g[f].apply(this._canvas[0]["_ctxMouseEvent"],e)}}},draw:function(z,u,w){this._graphicPointer=0;var y="ctx",m;if(!u){u=[]}if(!w){w={}}var m=this.getScene().getCanvas()._ctxTmp;var p,i={};var e={};var v=true,k=1,n=false;var r=function(B,g,A){if(B[g]||this._forceEvent){this._canvas[0]["_ctxMouseEvent"][g]=A;return 0}return 1};if(z&&typeof z!="string"){m=z;z=null}if(z){i[z]=[{params:u,propreties:w}];v=false}else{i=this._cmd}function f(C,g){for(var A=0;A<this._canvas.length;A++){e=C.propreties;if(v&&g=="restore"){this.clearPropreties()}if(e){for(var B in e){k=1;if(B=="globalAlpha"){e[B]=this.real_opacity}if(m){m[B]=e[B]}else{this._canvas[A][y][B]=e[B]}k&=r.call(this,e,"globalAlpha",1);k&=r.call(this,e,"strokeStyle","#"+this.color_key);k&=r.call(this,e,"fillStyle","#"+this.color_key);if(k){r.call(this,e,B,e[B])}}}if(m){m[g].apply(m,C.params)}else{this._canvas[A][y][g].apply(this._canvas[A][y],C.params);if(this._forceEvent){if(g=="rect"){this._bufferEvent("fillRect",C.params)}}this._bufferEvent(g,C.params)}}}var t,q;for(var l in i){for(var h in i[l]){p=i[l][h];f.call(this,p,l);if(l=="beginPath"){t=this._graphicCmd[this._graphicPointer];for(var o=0;o<t.length;o++){q=t[o];f.call(this,q,q.name)}this._graphicPointer++}}}},_addCmd:function(g,l,e,n){if(typeof e=="boolean"){n=e;e=false}l=l||[];e=e||[];var m=this._PROPS;e=e.concat(m);var i={};for(var f=0;f<e.length;f++){if(this[e[f]]){i[e[f]]=this[e[f]]}}i.globalAlpha=1;if(n){var h=this._graphicCmd[this._graphicCmd.length-1];if(!h){throw"error"}else{h.push({name:g,params:l,propreties:i})}}else{if(this.multiple&&typeof this._cmd[g]!=="undefined"&&this._cmd[g]!==null){this._cmd[g].push({params:l,propreties:i})}else{this._cmd[g]=[{params:l,propreties:i}]}}},hasCmd:function(e){return this._cmd[e]!==undefined},removeCmd:function(e){if(e=="clip"){this._useClip=false}delete this._cmd[e]}});Class.create("Element",{_children:[],_attr:{},x:0,y:0,real_x:0,real_y:0,real_scale_x:1,real_scale_y:1,real_rotate:0,real_skew_x:0,real_skew_y:0,real_opacity:1,real_propagation:true,scaleX:1,scaleY:1,skewX:0,skewY:0,opacity:1,rotation:0,width:null,height:null,regX:0,regY:0,parent:null,pause:false,_index:0,_id:null,_visible:true,_listener:{},_buffer_img:null,_out:1,_over:0,_nbEvent:0,_onRender:[],_pack:null,_useDOM:false,_forceEvent:false,propagationOpacity:null,initialize:function(l,h,i,e){var f=l.getCanvas();this._id=_CanvasEngine.uniqid();this._dom=document.createElement("div");this.width=i;this.height=e;this.scene=l;this.stage=l._stage;this.layer=h;var g,k=f._elementsByScene(this.scene.name);do{g=_CanvasEngine._getRandomColorKey()}while(g in k);this.color_key=g;this.scene.getCanvas()._elementsByScene(this.scene.name,g,this);this._canvas=b.el_canvas},_initParams:function(e){if(e||!this.parent){this.parent={scaleX:1,scaleY:1,real_x:0,real_y:0,real_scale_x:1,real_scale_y:1,real_rotate:0,real_skew_x:0,real_skew_y:0,real_opacity:1,real_propagation:true}}},refresh:function(){this._refresh(true,true);this._canvas._event_mouse=null},_refreshDOM:function(){var f={position:"absolute",opacity:this.opacity,width:this.width+"px",height:this.height+"px",display:this._visible?"block":"none"};var e={transform:"rotate("+this.rotation+"deg) scale("+this.scaleX+", "+this.scaleY+") skew("+this.skewX+"deg, "+this.skewY+"deg) translate("+this.x+"px, "+this.y+"px)","transform-origin":this.regX+" "+this.regY};_CanvasEngine.each(["","-webkit-","-moz-","-o-"],function(g,h){for(s in e){f[h+s]=e[s]}});_CanvasEngine.extend(this._dom.style,f)},_refresh:function(l,g,e){if(this.stage._onRefresh){this.stage._onRefresh(this)}if(!this._visible){this._loop();return}if(!this.real_pause){this._initParams(l);this.real_propagation=this.parent.propagationOpacity==null?true:this.parent.propagationOpacity;this.save();this.real_scale_x=this.parent.real_scale_x*this.scaleX;this.real_scale_y=this.parent.real_scale_y*this.scaleY;this.real_y=(this.parent.real_y+this.y);this.real_x=(this.parent.real_x+this.x);this.real_skew_x=this.parent.real_skew_x+this.skewX;this.real_skew_y=this.parent.real_skew_y+this.skewY;this.real_rotate=this.parent.real_rotate+this.rotation;if(this.real_propagation){this.real_opacity=this.parent.real_opacity*this.opacity}else{this.real_opacity=this.opacity}this.real_pause=l?this.pause:this.parent.real_pause;this.globalAlpha=this.real_opacity;if(this.parent){if(this.parent.regX){this.regX=this.parent.regX}if(this.parent.regY){this.regY=this.parent.regY}}var k=this.real_x+this.regX;var h=this.real_y+this.regY;if(this.regX!=0||this.regY!=0){this.translate(k,h)}if(this.real_rotate!=0){this.rotateDeg(this.real_rotate)}if(this.real_scale_x!=1||this.real_scale_y!=1||this.real_skew_x!=0||this.real_skew_y!=0){this.transform(this.real_scale_x,this.real_skew_x,this.real_skew_y,this.real_scale_y,0,0)}if(this.regX!=0||this.regY!=0){this.translate(-k,-h)}this.translate(this.real_x,this.real_y)}this.draw(e);if(!this._useClip){this.restore()}if(this._useDOM){this._refreshDOM()}if(g){if(!this.getScene()._pause){this._loop()}for(var f=0;f<this._children.length;f++){this._children[f]._refresh(false,true,e)}}if(this._useClip){this.restore()}},setX:function(e){this.x=e},setY:function(e){this.y=e},buffer:function(f,m){var l=this.children(),g=document.createElement("canvas"),e=g.getContext("2d"),o=this.getScene(),n=this.scene.getCanvas();g.width=f||n.width;g.height=m||n.height;this.scene.getCanvas()._ctxTmp=e;for(var k=0;k<l.length;k++){this._children[k]._refresh(true,true)}this.scene.getCanvas()._ctxTmp=null;return g},rotateTo:function(f,e){var g=parseInt(f);if(/rad$/.test(f)){g=g*180/Math.PI}this.rotation=e?360-g:g;this._stageRefresh();return this},setOriginPoint:function(e,f){if(e=="middle"){if(this.width&&this.height){e=Math.round(this.width/2);f=Math.round(this.height/2)}else{throw"Width and Height proprieties are not defined"}}if(e!==undefined){this.regX=+e}if(f!==undefined){this.regY=+f}return this},getScene:function(){return this.scene},_stageRefresh:function(){this.stage.refresh()},isStage:function(){return this._name=="__stage__"},_mousemove:function(l,g){var f,k;for(var h=0;h<this._children.length;h++){f=this._children[h];k=g.x>f.real_x&&g.x<f.real_x+f.width&&g.y>f.real_y&&g.y<f.real_y+f.height;if(k){if(f._out==1){f._out++;f._out++;f._over=1;_trigger=f.trigger("mouseover",l)}if(_trigger){return}}else{if(f._over==1){f._out=1;f._over++;_trigger=f.trigger("mouseout",l)}}}},_select:function(i,o){var h,e;var f=this.scene.getCanvas();var l=this._canvas[0],n=l.element.style.width,g=l.element.style.height,m=n!=""?~~(i.x*l.width/parseInt(n)):i.x,k=g!=""?~~(i.y*l.height/parseInt(g)):i.y;e=l._ctxMouseEvent.getImageData(m,k,1,1).data;if(e[3]>0){h=f._elementsByScene(this.scene.name,_CanvasEngine.rgbToHex(e[0],e[1],e[2]));if(h){o(h)}}},_click:function(h,f,g){this._select(f,function(e){e.trigger("click",h,f)})},_cloneRecursive:function(g){var k,h;if(g._children.length>0){for(var f=0;f<g._children.length;f++){k=g._children[f];h=this.scene.createElement();for(var e in k){if(typeof e!="function"){h[e]=k[e]}}h.parent=g;this._cloneRecursive(k);g._children[f]=h}}},clone:function(){var f=this.scene.createElement();for(var e in this){if(typeof e!="function"){f[e]=this[e]}}this._cloneRecursive(f);return f},append:function(m){var l,f=this;var g=this.scene.getCanvas();function k(i){if(i._useDOM&&i.parent){i.parent._dom.appendChild(i._dom);if(!f.isStage()){i.parent._useDOM=true;k(i.parent)}}}function e(i){i._useDOM=true;k(i);i._refreshDOM()}if(m instanceof Element){this._dom.appendChild(m);e(this);return this}else{if(typeof jQuery!="undefined"&&m instanceof jQuery){jQuery(this._dom).append(m);e(this);return this}}for(var h=0;h<arguments.length;h++){l=arguments[h];this._children.push(l);l.parent=this;l._refresh(false,true);k(l)}return arguments},prepend:function(e){this._children.push(e);e.parent=this;e.zIndex(0);return e},insertAfter:function(f){var e=f.parent.children();e.push(this);return this},children:function(g){var h=[],e=[];if(g){if(g instanceof Array){h=g}if(g instanceof Class){h=g.children()}for(var f=0;f<h.length;f++){e[f]=h[f].clone();e[f].parent=this}this._children=e}return this._children},detach:function(){this.remove();return this},pack:function(o,m,n){var f=this.children(),g=document.createElement("canvas"),p=g.getContext("2d"),l=this.getScene(),e;g.width=o;g.height=m;this.scene.getCanvas()._ctxTmp=p;for(var k=0;k<f.length;k++){this._children[k]._refresh(true,true)}this.scene.getCanvas()._ctxTmp=null;if(!n){this._pack=f}this.empty();e=l.createElement();e.drawImage(g);this.append(e);return this},cache:function(f,i,l){var g=document.createElement("canvas"),e=g.getContext("2d"),k=this.scene.getCanvas();if(typeof f=="boolean"){l=f;f=null}g.width=f||this.width;g.height=i||this.height;k._ctxTmp=e;this._refresh(true,true);k._ctxTmp=null;if(!l){this._cache=this._cmd}this._cmd=[];this.drawImage(g);return this},uncache:function(){if(!this._cache){throw"Use the method `cache` before or impossible because you release the memory with method `cache`"}this._cmd=[];this._refresh(true,true);this._cmd=this._cache;this._cache=null;return this},unpack:function(){if(!this._pack){throw"Use the method pack before or impossible because you release the memory with method pack"}this._children=this._pack;this._pack=null;return this},forceEvent:function(f){if(f==undefined){f=true}this._forceEvent=f;if(!f){this.removeCmd("rect");return this}var e=this.width,g=this.height;if(!e){e=this.img.width}if(!g){g=this.img.height}if(!e||!g){throw"forceEvent() : Before, indicate the size of element !"}this.beginPath();this.rect(0,0,e,g);this.closePath();return this},isAppend:function(){return this in this.parent.children()},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(f){var g=this.children(),e=g.length;if(Math.abs(f)>=e){f=-1}if(f<0){f=e+f}return g[f]},next:function(e,l){var g=this.zIndex();if(e){var k=this.parent.children(),f,m;for(var h=g+1;h<k.length;h++){m=k[h];f=this._findAttr(e,l,m);if(f){return m}}return false}return this.parent.eq(g+1)},prev:function(e,l){var g=this.zIndex();if(e){var k=this.parent.children(),f,m;for(var h=g-1;h>=0;h--){m=k[h];f=this._findAttr(e,l,m);if(f){return m}}return false}return this.parent.eq(g-1)},find:function(e){var g=this.children(),h=[];for(var f=0;f<g.length;f++){c=g[f];if(e==c.name){h.push(c)}}return h},_findAttr:function(e,g,h){var f=h.attr(e);if(f){if(g!=undefined){if(f==g){return h}}else{return h}}return false},findAttr:function(e,l){var h=this.children(),f,k=[];for(var g=0;g<h.length;g++){f=this._findAttr(e,l,h[g]);if(f){k.push(f)}}return k},zIndex:function(f){var e;if(!this.parent){throw"zIndex: No parent known for this element. Assign a parent of this element with append()"}if(f===undefined){return this.parent._children.indexOf(this)}if(f instanceof Class){f=f.zIndex()}e=this.parent._children.length;if(Math.abs(f)>=e){f=-1}if(f<0){f=e+f}_CanvasEngine.moveArray(this.parent._children,this.zIndex(),f);this._stageRefresh();return this},zIndexBefore:function(e){this.zIndex(e.zIndex()-1);return this},remove:function(){var g;var e=this.scene.getCanvas();for(var f=0;f<this.parent._children.length;f++){g=this.parent._children[f];if(this._id==g._id){if(e._layerDOM&&g._useDOM){e._layerDOM.removeChild(g._dom)}this.parent._children.splice(f,1);this._stageRefresh();return true}}return false},empty:function(){this._children=[];return this},attr:function(e,g,f){f=f==undefined?true:f;if(g===undefined){return this._attr[e]}if(this._attr[e]!=g&&f){this.trigger("element:attrChange",[e,g])}this._attr[e]=g;return this},removeAttr:function(e){if(this._attr[e]){delete this._attr[e]}return this},offset:function(f){if(f){var e=this.parent;if(f.left){this.x=f.left}if(f.right&&e){this.x=e.width-this.width}if(f.top){this.y=f.top}if(f.bottom&&e){this.y=e.height-this.height}return this}return{left:this.x,top:this.y}},position:function(){return{left:this.real_x,top:this.real_y}},scaleTo:function(e){this.scaleX=e;this.scaleY=e;return this},hide:function(){this._visible=false},show:function(){this._visible=true},toggle:function(){if(this._visible){this.hide()}else{this.show()}},bind:function(e,f){this.on(e,f)},on:function(f,h){var g;f=f.split(" ");for(var e=0;e<f.length;e++){g=f[e];if(g=="canvas:refresh"){this.stage._onRefresh=h}else{if(g=="canvas:render"){this._onRender.push(h)}else{if(b.mobileUserAgent&&g=="click"){g="touch"}}}if(!this._listener[g]){this._listener[g]=[];this._nbEvent++}this._listener[g].push(h)}},unbind:function(e,f){this.off(e,f)},off:function(f,h){var g;f=f.split(" ");for(var e=0;e<f.length;e++){g=f[e];if(h){if(g=="canvas:render"){for(var e=0;e<this._onRender.length;e++){if(this._onRender[e]==h){this._onRender.splice(e,1);break}}}for(var e=0;e<this._listener[g].length;e++){if(this._listener[g][e]==h){this._listener[g].splice(e,1);break}}}else{if(g=="canvas:render"){this._onRender=[]}if(this._listener[g]){delete this._listener[g];this._nbEvent--}}if(this._listener[g]&&this._listener[g].length==0){delete this._listener[g];this._nbEvent--}}},eventExist:function(e){return this._listener[e]&&this._listener[e].length>0},hasEvent:function(){return this._nbEvent>0},trigger:function(k,m){var l,f=false;k=k.split(" ");if(!(m instanceof Array)){m=[m]}for(var g=0;g<k.length;g++){l=k[g];if(this._listener[l]){for(var h=0;h<this._listener[l].length;h++){f=true;if(this._listener[l][h]){this._listener[l][h].apply(this,m)}}}}return f},click:function(e){this.on("click",e)},dblclick:function(e){this.on("dblclick",e)},mouseover:function(e){this.on("mouseover",e)},mouseout:function(e){this.on("mouseout",e)},_loop:function(){for(var e=0;e<this._onRender.length;e++){if(this._onRender[e]){this._onRender[e].call(this)}}},addLoopListener:function(e){this.on("canvas:render",e)},html:function(e){this._useDOM=true;this._dom.innerHTML=e;return this},css:function(e){this._useDOM=true;_CanvasEngine.extend(this._dom.style,e);return this}}).extend("Context");Global_CE=b=Class["new"]("CanvasEngineClass");return b};CanvasEngine.Core=CanvasEngine;CanvasEngine.Class=Class;var CE=CanvasEngine;
/*! Hammer.JS - v1.0.3 - 2013-03-02

 * http://eightmedia.github.com/hammer.js

 *

 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;

 * Licensed under the MIT license */
(function(F){var z=function(Q,P){return new z.Instance(Q,P||{})};z.defaults={stop_browser_behavior:{userSelect:"none",touchCallout:"none",touchAction:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};z.HAS_POINTEREVENTS=navigator.pointerEnabled||navigator.msPointerEnabled;z.HAS_TOUCHEVENTS=("ontouchstart" in F);z.EVENT_TYPES={};z.DIRECTION_DOWN="down";z.DIRECTION_LEFT="left";z.DIRECTION_UP="up";z.DIRECTION_RIGHT="right";z.POINTER_MOUSE="mouse";z.POINTER_TOUCH="touch";z.POINTER_PEN="pen";z.EVENT_START="start";z.EVENT_MOVE="move";z.EVENT_END="end";z.plugins={};z.READY=false;function e(){if(z.READY){return}z.event.determineEventTypes();for(var P in z.gestures){if(z.gestures.hasOwnProperty(P)){z.detection.register(z.gestures[P])}}z.event.onTouch(document,z.EVENT_MOVE,z.detection.detect);z.event.onTouch(document,z.EVENT_END,z.detection.endDetect);z.READY=true}z.Instance=function(R,Q){var P=this;e();this.element=R;this.enabled=true;this.options=z.utils.extend(z.utils.extend({},z.defaults),Q||{});if(this.options.stop_browser_behavior){z.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior)}z.event.onTouch(R,z.EVENT_START,function(S){if(P.enabled){z.detection.startDetect(P,S)}});return this};z.Instance.prototype={on:function G(Q,R){var S=Q.split(" ");for(var P=0;P<S.length;P++){this.element.addEventListener(S[P],R,false)}return this},off:function o(Q,R){var S=Q.split(" ");for(var P=0;P<S.length;P++){this.element.removeEventListener(S[P],R,false)}return this},trigger:function K(P,R){var Q=document.createEvent("Event");Q.initEvent(P,true,true);Q.gesture=R;this.element.dispatchEvent(Q);return this},enable:function d(P){this.enabled=P;return this}};var J=null;var l=false;var h=false;z.event={bindDom:function(R,T,S){var Q=T.split(" ");for(var P=0;P<Q.length;P++){R.addEventListener(Q[P],S,false)}},onTouch:function C(R,Q,S){var P=this;this.bindDom(R,z.EVENT_TYPES[Q],function(T){var U=T.type.toLowerCase();if(U.match(/mouseup/)&&h){h=false;return}if(U.match(/touch/)||(U.match(/mouse/)&&T.which===1)||(z.HAS_POINTEREVENTS&&U.match(/down/))){l=true}if(U.match(/touch|pointer/)){h=true}if(l&&!(h&&U.match(/mouse/))){if(z.HAS_POINTEREVENTS&&Q!=z.EVENT_END){z.PointerEvent.updatePointer(Q,T)}if(Q===z.EVENT_END&&J!==null){T=J}else{J=T}S.call(z.detection,P.collectEventData(R,Q,T));if(z.HAS_POINTEREVENTS&&Q==z.EVENT_END){z.PointerEvent.updatePointer(Q,T)}}if(U.match(/up|cancel|end/)){l=false;J=null;z.PointerEvent.reset()}})},determineEventTypes:function I(){var P;if(z.HAS_POINTEREVENTS){P=z.PointerEvent.getEvents()}else{P=["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"]}z.EVENT_TYPES[z.EVENT_START]=P[0];z.EVENT_TYPES[z.EVENT_MOVE]=P[1];z.EVENT_TYPES[z.EVENT_END]=P[2]},getTouchList:function u(P){if(z.HAS_POINTEREVENTS){return z.PointerEvent.getTouchList()}else{if(P.touches){return P.touches}else{return[{identifier:1,pageX:P.pageX,pageY:P.pageY,target:P.target}]}}},collectEventData:function N(R,Q,S){var T=this.getTouchList(S,Q);var P=z.POINTER_TOUCH;if(S.type.match(/mouse/)||z.PointerEvent.matchType(z.POINTER_MOUSE,S)){P=z.POINTER_MOUSE}return{center:z.utils.getCenter(T),timestamp:S.timestamp||new Date().getTime(),target:S.target,touches:T,eventType:Q,pointerType:P,srcEvent:S,preventDefault:function(){if(this.srcEvent.preventManipulation){this.srcEvent.preventManipulation()}if(this.srcEvent.preventDefault){this.srcEvent.preventDefault()}},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return z.detection.stopDetect()}}}};z.PointerEvent={pointers:{},getTouchList:function(){var P=this.pointers;var Q=[];Object.keys(P).sort().forEach(function(R){Q.push(P[R])});return Q},updatePointer:function(Q,P){if(Q==z.EVENT_END){delete this.pointers[P.pointerId]}else{P.identifier=P.pointerId;this.pointers[P.pointerId]=P}},matchType:function(P,R){if(!R.pointerType){return false}var Q={};Q[z.POINTER_MOUSE]=(R.pointerType==R.MSPOINTER_TYPE_MOUSE||R.pointerType==z.POINTER_MOUSE);Q[z.POINTER_TOUCH]=(R.pointerType==R.MSPOINTER_TYPE_TOUCH||R.pointerType==z.POINTER_TOUCH);Q[z.POINTER_PEN]=(R.pointerType==R.MSPOINTER_TYPE_PEN||R.pointerType==z.POINTER_PEN);return Q[P]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}};z.utils={extend:function i(P,R){for(var Q in R){P[Q]=R[Q]}return P},getCenter:function A(S){var T=[],R=[];for(var Q=0,P=S.length;Q<P;Q++){T.push(S[Q].pageX);R.push(S[Q].pageY)}return{pageX:((Math.min.apply(Math,T)+Math.max.apply(Math,T))/2),pageY:((Math.min.apply(Math,R)+Math.max.apply(Math,R))/2)}},getVelocity:function p(P,R,Q){return{x:Math.abs(R/P)||0,y:Math.abs(Q/P)||0}},getAngle:function n(R,Q){var S=Q.pageY-R.pageY,P=Q.pageX-R.pageX;return Math.atan2(S,P)*180/Math.PI},getDirection:function k(R,Q){var P=Math.abs(R.pageX-Q.pageX),S=Math.abs(R.pageY-Q.pageY);if(P>=S){return R.pageX-Q.pageX>0?z.DIRECTION_LEFT:z.DIRECTION_RIGHT}else{return R.pageY-Q.pageY>0?z.DIRECTION_UP:z.DIRECTION_DOWN}},getDistance:function m(R,Q){var P=Q.pageX-R.pageX,S=Q.pageY-R.pageY;return Math.sqrt((P*P)+(S*S))},getScale:function y(Q,P){if(Q.length>=2&&P.length>=2){return this.getDistance(P[0],P[1])/this.getDistance(Q[0],Q[1])}return 1},getRotation:function v(Q,P){if(Q.length>=2&&P.length>=2){return this.getAngle(P[1],P[0])-this.getAngle(Q[1],Q[0])}return 0},isVertical:function D(P){return(P==z.DIRECTION_UP||P==z.DIRECTION_DOWN)},stopDefaultBrowserBehavior:function b(R,Q){var U,T=["webkit","khtml","moz","ms","o",""];if(!Q||!R.style){return}for(var P=0;P<T.length;P++){for(var S in Q){if(Q.hasOwnProperty(S)){U=S;if(T[P]){U=T[P]+U.substring(0,1).toUpperCase()+U.substring(1)}R.style[U]=Q[S]}}}if(Q.userSelect=="none"){R.onselectstart=function(){return false}}}};z.detection={gestures:[],current:null,previous:null,stopped:false,startDetect:function B(Q,P){if(this.current){return}this.stopped=false;this.current={inst:Q,startEvent:z.utils.extend({},P),lastEvent:false,name:""};this.detect(P)},detect:function r(S){if(!this.current||this.stopped){return}S=this.extendEventData(S);var T=this.current.inst.options;for(var R=0,P=this.gestures.length;R<P;R++){var Q=this.gestures[R];if(!this.stopped&&T[Q.name]!==false){if(Q.handler.call(Q,S,this.current.inst)===false){this.stopDetect();break}}}if(this.current){this.current.lastEvent=S}},endDetect:function E(P){this.detect(P);this.stopDetect()},stopDetect:function a(){this.previous=z.utils.extend({},this.current);this.current=null;this.stopped=true},extendEventData:function w(T){var U=this.current.startEvent;if(U&&(T.touches.length!=U.touches.length||T.touches===U.touches)){U.touches=[];for(var R=0,P=T.touches.length;R<P;R++){U.touches.push(z.utils.extend({},T.touches[R]))}}var Q=T.timestamp-U.timestamp,W=T.center.pageX-U.center.pageX,V=T.center.pageY-U.center.pageY,S=z.utils.getVelocity(Q,W,V);z.utils.extend(T,{deltaTime:Q,deltaX:W,deltaY:V,velocityX:S.x,velocityY:S.y,distance:z.utils.getDistance(U.center,T.center),angle:z.utils.getAngle(U.center,T.center),direction:z.utils.getDirection(U.center,T.center),scale:z.utils.getScale(U.touches,T.touches),rotation:z.utils.getRotation(U.touches,T.touches),startEvent:U});return T},register:function f(Q){var P=Q.defaults||{};if(typeof(P[Q.name])=="undefined"){P[Q.name]=true}z.utils.extend(z.defaults,P);Q.index=Q.index||1000;this.gestures.push(Q);this.gestures.sort(function(S,R){if(S.index<R.index){return -1}if(S.index>R.index){return 1}return 0});return this.gestures}};z.gestures=z.gestures||{};z.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function M(P,Q){switch(P.eventType){case z.EVENT_START:clearTimeout(this.timer);z.detection.current.name=this.name;this.timer=setTimeout(function(){if(z.detection.current.name=="hold"){Q.trigger("hold",P)}},Q.options.hold_timeout);break;case z.EVENT_MOVE:if(P.distance>Q.options.hold_threshold){clearTimeout(this.timer)}break;case z.EVENT_END:clearTimeout(this.timer);break}}};z.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,doubletap_distance:20,doubletap_interval:300},handler:function H(Q,R){if(Q.eventType==z.EVENT_END){var P=z.detection.previous;if(Q.deltaTime>R.options.tap_max_touchtime||Q.distance>R.options.tap_max_distance){return}if(P&&P.name=="tap"&&(Q.timestamp-P.lastEvent.timestamp)<R.options.doubletap_interval&&Q.distance<R.options.doubletap_distance){z.detection.current.name="doubletap"}else{z.detection.current.name="tap"}R.trigger(z.detection.current.name,Q)}}};z.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:0.7},handler:function O(P,Q){if(P.eventType==z.EVENT_END){if(Q.options.swipe_max_touches>0&&P.touches.length>Q.options.swipe_max_touches){return}if(P.velocityX>Q.options.swipe_velocity||P.velocityY>Q.options.swipe_velocity){Q.trigger(this.name,P);Q.trigger(this.name+P.direction,P)}}}};z.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:false,drag_block_vertical:false,drag_lock_to_axis:false},triggered:false,handler:function t(P,Q){if(z.detection.current.name!=this.name&&this.triggered){Q.trigger(this.name+"end",P);this.triggered=false;return}if(Q.options.drag_max_touches>0&&P.touches.length>Q.options.drag_max_touches){return}switch(P.eventType){case z.EVENT_START:this.triggered=false;break;case z.EVENT_MOVE:if(P.distance<Q.options.drag_min_distance&&z.detection.current.name!=this.name){return}z.detection.current.name=this.name;var R=z.detection.current.lastEvent.direction;if(Q.options.drag_lock_to_axis&&R!==P.direction){if(z.utils.isVertical(R)){P.direction=(P.deltaY<0)?z.DIRECTION_UP:z.DIRECTION_DOWN}else{P.direction=(P.deltaX<0)?z.DIRECTION_LEFT:z.DIRECTION_RIGHT}}if(!this.triggered){Q.trigger(this.name+"start",P);this.triggered=true}Q.trigger(this.name,P);Q.trigger(this.name+P.direction,P);if((Q.options.drag_block_vertical&&z.utils.isVertical(P.direction))||(Q.options.drag_block_horizontal&&!z.utils.isVertical(P.direction))){P.preventDefault()}break;case z.EVENT_END:if(this.triggered){Q.trigger(this.name+"end",P)}this.triggered=false;break}}};z.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:0.01,transform_min_rotation:1,transform_always_block:false},triggered:false,handler:function q(R,S){if(z.detection.current.name!=this.name&&this.triggered){S.trigger(this.name+"end",R);this.triggered=false;return}if(R.touches.length<2){return}if(S.options.transform_always_block){R.preventDefault()}switch(R.eventType){case z.EVENT_START:this.triggered=false;break;case z.EVENT_MOVE:var Q=Math.abs(1-R.scale);var P=Math.abs(R.rotation);if(Q<S.options.transform_min_scale&&P<S.options.transform_min_rotation){return}z.detection.current.name=this.name;if(!this.triggered){S.trigger(this.name+"start",R);this.triggered=true}S.trigger(this.name,R);if(P>S.options.transform_min_rotation){S.trigger("rotate",R)}if(Q>S.options.transform_min_scale){S.trigger("pinch",R);S.trigger("pinch"+((R.scale<1)?"in":"out"),R)}break;case z.EVENT_END:if(this.triggered){S.trigger(this.name+"end",R)}this.triggered=false;break}}};z.gestures.Touch={name:"touch",index:-Infinity,defaults:{prevent_default:false},handler:function g(P,Q){if(Q.options.prevent_default){P.preventDefault()}if(P.eventType==z.EVENT_START){Q.trigger(this.name,P)}}};z.gestures.Release={name:"release",index:Infinity,handler:function L(P,Q){if(P.eventType==z.EVENT_END){Q.trigger(this.name,P)}}};if(typeof module==="object"&&typeof module.exports==="object"){module.exports=z}else{F.Hammer=z;if(typeof F.define==="function"&&F.define.amd){F.define("hammer",[],function(){return z})}}})(this);var Ease={linear:function(e,f,a,h,g){return h*(f/=g)+a},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,m,l){var i=1.70158;var k=0;var g=m;if(h==0){return e}if((h/=l)==1){return e+m}if(!k){k=l*0.3}if(g<Math.abs(m)){g=m;var i=k/4}else{var i=k/(2*Math.PI)*Math.asin(m/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*l-i)*(2*Math.PI)/k))+e},easeOutElastic:function(f,h,e,m,l){var i=1.70158;var k=0;var g=m;if(h==0){return e}if((h/=l)==1){return e+m}if(!k){k=l*0.3}if(g<Math.abs(m)){g=m;var i=k/4}else{var i=k/(2*Math.PI)*Math.asin(m/g)}return g*Math.pow(2,-10*h)*Math.sin((h*l-i)*(2*Math.PI)/k)+m+e},easeInOutElastic:function(f,h,e,m,l){var i=1.70158;var k=0;var g=m;if(h==0){return e}if((h/=l/2)==2){return e+m}if(!k){k=l*(0.3*1.5)}if(g<Math.abs(m)){g=m;var i=k/4}else{var i=k/(2*Math.PI)*Math.asin(m/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*l-i)*(2*Math.PI)/k))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*l-i)*(2*Math.PI)/k)*0.5+m+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}};Class.create("Timeline",{_timeline:{},_frequence:0,_stop:false,_propreties:[],_key_times:[],_onFinish:null,_varTime:{},initialize:function(a){this._frequence=0;this.el=a;this.addProprety(["opacity","x","y","scaleX","scaleY","rotation"]);this._loop()},to:function(a,e,d,b){if(d){a._ease_=d}if(!b){b="set"}this._key_times.push(e);this._timeline[e]=a;this._timeline[e]._cal=b;return this},wait:function(b){var a=this.getLastKey();this.to(a,b,false,"wait");return this},getLastKey:function(){var b=this._key_times[this._key_times.length-1];if(!b){var d={};for(var a=0;a<this._propreties.length;a++){d[this._propreties[a]]=this.el[this._propreties[a]]}return d}return this._timeline[b]},add:function(a,d,b){return this.to(a,d,b,"add")},addProprety:function(a){if(!(a instanceof Array)){a=[a]}for(var b=0;b<a.length;b++){this._propreties.push(a[b])}},loop:function(){var a=this;this.call(function(){a._stop=false;return true})},_initVar:function(){this._varTime={freq:this._frequence,time:0,time_tmp:0,last_t:0,next_t:0,find_next:false}},_loop:function(){var a=this,b;this.el.addLoopListener(function(){if(a._varTime.time===undefined){return}var e=a._varTime._frequence,f=a._varTime.time,h=a._varTime.time_tmp,n=a._varTime.last_t,m=a._varTime.next_t,p=a._varTime.find_next;function k(){var t={};for(var r=0;r<a._propreties.length;r++){t[a._propreties[r]]=+this[a._propreties[r]]}a._timeline["0"]=t}function l(i){var t,r;if(a._timeline[m][i]===undefined){return this[i]}t=a._timeline[m]._cal;r=a._timeline[m][i];switch(t){case"add":r+=a._timeline[n][i];break}return r}function d(i){var w,t,v,r,u;if(a._timeline[m][i]===undefined){return this[i]}w=a._timeline[m]._ease_;v=a._timeline[m]._cal;u=a._timeline[m][i];switch(v){case"add":u+=a._timeline[n][i];break}if(!w){w=Ease.linear}t=w(u,(m-n)-h,a._timeline[n][i],u-a._timeline[n][i],m-n);return t}e=0;var q;if(a._stop){return}e++;if(e>=a._frequence){if(f==0){k.call(this)}if(h==0){p=false;for(var o in a._timeline){if(o>f){n=m?m:0;m=o;p=true;break}}if(!p){a._stop=true;f=0;n=0;h=0;if(a._onFinish){b=a._onFinish.call(this)}if(!b){return}else{k.call(this);m=0}}}h=m-f;if(h!=0){if(a._timeline[m]._cal!="wait"){if(h==1){for(var g=0;g<a._propreties.length;g++){this[a._propreties[g]]=l.call(this,a._propreties[g])}}else{for(var g=0;g<a._propreties.length;g++){this[a._propreties[g]]=d.call(this,a._propreties[g])}}}}f++}a._varTime._frequence=e;a._varTime.time=f;a._varTime.time_tmp=h;a._varTime.last_t=n;a._varTime.next_t=m;a._varTime.find_next=p})},call:function(a){this._initVar();this._onFinish=a;this._stop=false}});Class.create("Animation",{_images:[],_frames:{},_animations:{},_frequence:0,_stop:false,_timeline:null,_onFinish:null,_seq:null,_loop:false,_els:null,el:null,initialize:function(a){this._options=a;this._images=a.images;this._animations=a.animations;this._timeline=a.timeline;if(a.addIn){this.el=a.addIn.scene.createElement();a.addIn.append(this.el);this.add()}},remove:function(a){if(a){this.el=a}this.el.off("canvas:render");return this},add:function(e,h){if(e){this.el=e}var a=this;var d=0;var g=null;var f=0;var b;if(h){this.remove()}this.stop();this.el.addLoopListener(function(){if(a._seq!==b){b=a._seq;d=0;g=null}var y=a._animations[a._seq],p=a._loop=="loop";function v(z){if(y.size){return y.size}var A=Global_CE.Materials.get(z);y.size={width:A.width,height:A.height}}if(y&&!y.frequence){y.frequence=0}if(g==null&&y){g=y.frequence}if(a._stop){if(y){g=y.frequence}d=0;return}g++;if(g>=y.frequence){if(a._images instanceof Array){var n=a._images[f];v(n);this.drawImage(n);f++;if(f>=a._images.length){f=0;if(!p){a._stop=true}}}else{var n=Global_CE.Materials.get(a._images),u=0,r=0;v(a._images);var w;var q=n.width/y.size.width;var o=n.height/y.size.height;var k;var l;function i(D,C){var A=a._images;if(y.patternSize){y.size={width:n.width/y.patternSize.width,height:n.height/y.patternSize.height}}r=parseInt(C/Math.round(n.width/y.size.width));u=(C%Math.round(n.width/y.size.width));var z=y.size.width*u,B=y.size.height*r;D.trigger("animation:draw",C);if(y.image){A=y.image}if(!y.position){y.position={}}if(!y.position.left){y.position.left=0}if(!y.position.top){y.position.top=0}D.drawImage(A,z,B,y.size.width,y.size.height,y.position.left,y.position.top,y.size.width,y.size.height)}function t(){if(a._loop=="stop"){if(y.finish){y.finish.call(a)}a.stop();return true}else{if(a._loop=="remove"){if(a._options.addIn){this.empty()}else{this.remove()}if(y.finish){y.finish.call(a)}a.stop();return true}}return false}if(y.frames[0] instanceof Array){if(y.frames[d]===undefined){d=0;if(t.call(this)){return}}this.empty();y.framesDefault=y.framesDefault||{};if(!y.framesDefault.x){y.framesDefault.x=0}if(!y.framesDefault.y){y.framesDefault.y=0}if(!y.framesDefault.zoom){y.framesDefault.zoom=100}if(!y.framesDefault.opacity){y.framesDefault.opacity=255}if(!y.framesDefault.rotation){y.framesDefault.rotation=0}if(!y.frames[d]){d++;return}for(var m=0;m<y.frames[d].length;m++){w=y.frames[d][m];if(w){l=this.scene.createElement(y.size.width,y.size.height);k=w.pattern-1;l.setOriginPoint("middle");l.x=w.x!=undefined?w.x:y.framesDefault.x;l.y=w.y!=undefined?w.y:y.framesDefault.y;l.scaleX=w.zoom!=undefined?w.zoom/100:y.framesDefault.zoom/100;l.scaleY=w.zoom!=undefined?w.zoom/100:y.framesDefault.zoom/100;l.opacity=w.opacity!=undefined?w.opacity/255:y.framesDefault.opacity/255;l.rotation=w.rotation!=undefined?w.rotation:y.framesDefault.rotation;i(l,k);this.append(l)}}}else{k=y.frames[0]+d;if(k>y.frames[1]){d=0;t.call(this);i(this,y.frames[0])}else{i(this,k)}}d++}g=0}})},isStopped:function(){return this._stop},stop:function(){this._stop=true;return this},play:function(a,b){this._loop=b;this._seq=a;this._stop=false;return this}});var Animation={Timeline:{New:function(){return this["new"].apply(this,arguments)},"new":function(a){return Class["new"]("Timeline",[a])}},Animation:{New:function(){return this["new"].apply(this,arguments)},"new":function(a){return Class["new"]("Animation",[a])}}};var Input={Input:{keyBuffer:[],cacheKeyBuffer:[],_keyFunctions:{},_keyPress:{},_keyUp:{},_keyType:{},_keyPressed:{},_lock:{},_rules:{},_key:function(d,b,f){if(typeof b=="function"){b(d)}else{if(b instanceof Array){for(var a=0;a<b.length;a++){if(d.which==b[a]){if(f){f(d)}}}}else{if(d.which==b){if(f){f(d)}}}}},press:function(b,a){this._press("keyPress",b,a);this.keyUp(b)},clearKeys:function(a){this.press(a,function(){})},keyDown:function(b,a){this._press("keyDown",b,a)},keyUp:function(e,b){var a=this;if(e instanceof Array){for(var d=0;d<e.length;d++){a._keyUp[e[d]]=b}}else{a._keyUp[e]=b}document.onkeyup=function(f){a._keyPress[f.which]=0;a._keyPressed[f.which]=false;if(a._keyUp[f.which]){a._keyUp[f.which](f)}}},_press:function(h,g,d){var a=this;if(typeof g=="string"){g=this._rules[g]}if(g instanceof Array){for(var f=0;f<g.length;f++){e(g[f],h)}}else{e(g,h)}if(this._lock.canvas){var b=this._lock.canvas;b.onkeydown=k;b.onfocus=function(i){document.onkeydown=function(){return false};if(a._lock.onFocus){a._lock.onFocus(i,b)}};b.onblur=function(i){document.onkeydown=null;if(a._lock.onBlur){a._lock.onBlur(i,b)}}}else{document.onkeydown=k}function k(l){var i;if(!a._keyPress[l.which]){a._keyPress[l.which]=0}a._keyPress[l.which]++;if(a._keyPress[l.which]>1&&a._keyType[l.which]=="keyPress"){return}a._keyPressed[l.which]=true;if(a._keyFunctions[l.which]){i=a._keyFunctions[l.which](l)}if(i!==undefined){return i}else{return false}}function e(l,i){a._keyType[l]=i;a._keyFunctions[l]=d}},reset:function(b){this._keyPressed={};if(b){for(var a=0;a<b.length;a++){this._keyFunctions[b[a]]=null}}else{this._keyFunctions={}}},lock:function(a,f,b,d){var e=document.getElementById(a);e.setAttribute("tabindex",1);if(f){e.focus();document.onkeydown=function(){return false}}this._lock.canvas=e;this._lock.onFocus=b;this._lock.onBlur=d},isPressed:function(b){if(!(b instanceof Array)){b=[b]}for(var a=0;a<b.length;a++){if(this._keyPressed[b[a]]){return true}}return false},addKey:function(b,a){Input[b]=a},memorize:function(){this.cacheKeyBuffer=this.keyBuffer},restore:function(){this.keyBuffer=this.cacheKeyBuffer},trigger:function(d,e,a){var f,b,g;if(e=="press"){this.trigger(d,"down");this.trigger(d,"up",a);return}if(this._lock.canvas){b=this._lock.canvas}else{b=document}if(document.createEventObject){f=document.createEventObject();f.keyCode=d;b.fireEvent("onkey"+e,f)}else{if(document.createEvent){f=document.createEvent("Events");f.initEvent("key"+e,true,true);f.which=d;b.dispatchEvent(f)}}if(a){g=document.getElementById(a.id+"-dom");g.focus()}},addRule:function(b,a){this._rules[b]=a},Gamepad:{_listener:{},gamepad:null,_onConnect:null,_onDisconnect:null,_connectState:false,init:function(a,b){this._onConnect=a;this._onDisconnect=b;return this},getState:function(a){this.gamepad=Gamepad.getStates()[a];if(this.gamepad&&!this._connectState){if(this._onConnect){this._onConnect()}this._connectState=true}else{if(!this.gamepad&&this._connectState){if(this._onDisconnect){this._onDisconnect()}this._connectState=false}}},addListener:function(e,d,f){var a=Input.Input;if(typeof d!="function"){var b=d;d=function(){a.trigger(b,"down")};f=function(){a.trigger(b,"up")}}this._listener[e]={onDown:d,onUp:f,state:false}},update:function(){this.getState(0);if(!this.gamepad){return}for(var a in this._listener){if(this.gamepad[a]==1&&!this._listener[a].state){if(this._listener[a].onDown){this._listener[a].onDown()}this._listener[a].state=true}else{if(this.gamepad[a]==0&&this._listener[a].state){if(this._listener[a].onUp){this._listener[a].onUp()}this._listener[a].state=false}}}}},accelerometer:function(b){if(window.DeviceOrientationEvent){window.addEventListener("deviceorientation",function(d){a(d.alpha,d.beta,d.gamma)},false)}else{if(window.OrientationEvent){window.addEventListener("MozOrientation",function(d){a(d.x,d.y,d.z)},false)}}function a(d,f,e){b(d,f,e)}}}};Input.A=65;Input.Z=90;Input.E=69;Input.Q=81;Input.Esc=27;Input.Enter=13;Input.Shift=16;Input.Ctrl=17;Input.Alt=18;Input.Space=32;Input.Back=8;Input.F1=112;Input.F2=113;Input.F11=122;Input.F12=123;Input.Left=37;Input.Up=38;Input.Right=39;Input.Bottom=40;var BISON;(function(n,f){var o=(function(){var u=new n(255);for(var w=0;w<256;w++){u[w]=String.fromCharCode(w)}var y=new n(8),v=new n(8);for(var w=0;w<9;w++){y[w]=~((v[w]=Math.pow(2,w)-1)^255)}var C="",B=0,t=8,z=0,A=0;return{open:function(i){t=8;if(i!==f){A=i.length;z=0;C=i;B=C.charCodeAt(z)}else{B=0;C=""}},close:function(){if(B>0){C+=u[B]}return C},writeRaw:function(i){if(t!==8){C+=u[B];B=0;t=8}C+=i},readRaw:function(i){if(t!==8){z++;B=0;t=8}var E=C.substr(z,i);z+=i;B=C.charCodeAt(z);return E},write:function D(G,F){var H=F-t,E=t<F?t:F,i=t-E;if(H>0){B+=G>>H<<i}else{B+=G<<i}t-=E;if(t===0){C+=u[B];t=8;B=0;if(H>0){D(G&v[H],H)}}},read:function r(F){if(z>=A){return null}var H=F-t,E=t<F?t:F,i=t-E;var G=(B&y[t])>>i;t-=E;if(t===0){B=C.charCodeAt(++z);t=8;if(H>0){G=G<<H|r(H)}}return G}}})();var q=o.write,d=o.read,g=o.writeRaw,e=o.readRaw,l=o.open,p=o.close;function b(B,A){if(typeof B==="number"){var z=B!==(B|0),u=0;if(B<0){B=-B;u=1}q(1+z,3);if(z){var r=1,t=10;while(t<=B){r++;t*=10}r=(8-r)+1;B=Math.round(B*(1000000000/t));while(B/10===((B/10)|0)){B/=10;r--}}if(B<2){q(B,4)}else{if(B<16){q(1,3);q(B,4)}else{if(B<256){q(2,3);q(B,8)}else{if(B<4096){q(3,3);q(B>>8&255,4);q(B&255,8)}else{if(B<65536){q(4,3);q(B>>8&255,8);q(B&255,8)}else{if(B<1048576){q(5,3);q(B>>16&255,4);q(B>>8&255,8);q(B&255,8)}else{if(B<16777216){q(6,3);q(B>>16&255,8);q(B>>8&255,8);q(B&255,8)}else{q(7,3);q(B>>24&255,8);q(B>>16&255,8);q(B>>8&255,8);q(B&255,8)}}}}}}}q(u,1);if(z){q(r,4)}}else{if(typeof B==="string"){var v=B.length;q(3,3);if(v>65535){q(31,5);q(v>>24&255,8);q(v>>16&255,8);q(v>>8&255,8);q(v&255,8)}else{if(v>255){q(30,5);q(v>>8&255,8);q(v&255,8)}else{if(v>28){q(29,5);q(v,8)}else{q(v,5)}}}g(B)}else{if(typeof B==="boolean"){q(+B,5)}else{if(B===null){q(2,5)}else{if(B instanceof n){q(4,3);for(var w=0,v=B.length;w<v;w++){b(B[w])}if(!A){q(6,3)}}else{q(5,3);for(var y in B){b(y);b(B[y])}if(!A){q(6,3)}}}}}}}function m(i){l();b(i,true);q(0,3);q(3,2);return p()}var h=new n(16);for(var k=0;k<16;k++){h[k]=Math.pow(10,k)}function a(w){var A=[],u=-1,y,z,B,t,v=false,D,r,C;l(w);while(true){y=d(3);if(y===0){B=d(2);if(B===2){B=null}else{if(B<2){B=!!B}else{if(B===3){break}}}}else{if(y===1||y===2){switch(d(3)){case 0:B=d(1);break;case 1:B=d(4);break;case 2:B=d(8);break;case 3:B=(d(4)<<8)+d(8);break;case 4:B=(d(8)<<8)+d(8);break;case 5:B=(d(4)<<16)+(d(8)<<8)+d(8);break;case 6:B=(d(8)<<16)+(d(8)<<8)+d(8);break;case 7:B=(d(8)<<24)+(d(8)<<16)+(d(8)<<8)+d(8);break}if(d(1)){B=-B}if(y===2){B/=h[d(4)]}}else{if(y===3){var E=d(5);switch(E){case 31:E=(d(8)<<24)+(d(8)<<16)+(d(8)<<8)+d(8);break;case 30:E=(d(8)<<8)+d(8);break;case 29:E=d(8);break}B=e(E);if(v){D=B;v=false;continue}}else{if(y===4||y===5){v=y===5;B=v?{}:[];if(C===f){C=B}else{if(r){z[D]=B}else{z.push(B)}}z=A[++u]=B;r=!(z instanceof Array);continue}else{if(y===6){z=A[--u];v=r=!(z instanceof Array);continue}}}}}if(r){z[D]=B;v=true}else{if(z!==f){z.push(B)}else{return B}}}return C}if(typeof window==="undefined"){exports.encode=m;exports.decode=a;BISON=exports}else{window.BISON={encode:m,decode:a}}})(Array);if(typeof exports!="undefined"){var CE=require("canvasengine").listen(),Class=CE.Class}Class.create("Marshal",{_pointer:{},_cache:{},_stack_dump:[],_decode:function(b){if(typeof navigator!="undefined"&&navigator.appName=="Microsoft Internet Explorer"){try{return JSON.parse(b)}catch(a){}}else{return BISON.decode(b)}},_encode:function(b){if(typeof navigator!="undefined"&&navigator.appName=="Microsoft Internet Explorer"){try{return JSON.stringify(b)}catch(a){}}else{return BISON.encode(b)}},exist:function(a){return typeof localStorage!="undefined"&&localStorage[a]},_recursiveData:function(f,l,h){var k,g={},d={},b;h=h||[];if(f instanceof Object){for(var a in f){b=f[a];if(typeof b!="function"&&(CE.Core||CE).inArray(a,h)==-1){if(b instanceof Array){d[a]=[];for(var e=0;e<b.length;e++){d[a][e]=this._recursiveData(b[e],l,h)}}else{if(b instanceof Object){d[a]=this._recursiveData(b,l,h)}else{if(b!==undefined){d[a]=b}}}}}}else{if(typeof f!="function"&&f!==undefined){return f}}if(l=="load"){if(d.__name__){g=Class.New(f.__name__,false);for(var a in d){if(typeof g[a]!="function"){g[a]=d[a]}}}else{g=d}}else{g=d}return g},load:function(b,e){var f,a,d;if(this._pointer[b]===undefined){this._pointer[b]=0}if(this._cache[b]){f=this._cache[b]}else{if(e){f=this._decode(e)||[];this._cache[b]=f}else{if(typeof localStorage!="undefined"){f=this._decode(localStorage[b])||[];this._cache[b]=f}}}a=this._recursiveData(f[this._pointer[b]],"load");if(!e&&!this.exist(b)){return false}this._pointer[b]++;return a},dump:function(b,d,f){var e=[],a={};if(typeof b=="number"||typeof b=="string"||b instanceof Array){a=b}else{a=this._recursiveData(b,"save",f)}this._stack_dump.push(a);if(typeof localStorage!="undefined"){localStorage[d]=this._encode(this._stack_dump)}},getStack:function(a){return !a?this._stack_dump:this._encode(this._stack_dump)},remove:function(a){if(typeof localStorage!="undefined"){localStorage.removeItem(a);return true}return false}});var Marshal=Class.New("Marshal");Class.create("Scrolling",{main_el:null,scroll_el:[],scene:null,freeze:false,initialize:function(d,b,a){this.scene=d;this.tile_h=b;this.tile_w=a},setMainElement:function(a){this.main_el=a},addScroll:function(a){if(!a.screen_x){a.screen_x=0}if(!a.screen_y){a.screen_y=0}if(!a.parallax_x){a.parallax_x=0}if(!a.parallax_y){a.parallax_y=0}this.scroll_el.push(a);if(this.main_el){this.setScreen(a)}return this.scroll_el[this.scroll_el.length-1]},setScreen:function(h,b,a){var d,i;if(!b&&this.main_el){b=this.main_el.x;a=this.main_el.y}var e=this.scene.getCanvas();if(b<=e.width/2){d=0}else{if(b+e.width/2>=h.width){d=-(h.width-e.width)}else{d=-(b-e.width/2+(e.width/2%this.tile_w))}}if(a<=e.height/2){i=0}else{if(a+e.height/2>=h.height){i=-(h.height-e.height)}else{i=-(a-e.height/2+(e.height/2%this.tile_h))}}h.element.x=d;h.element.y=i;var k=this.tile_w/h.speed;var g=this.tile_h/h.speed;h.element.x=Math.floor(h.element.x/k)*k;h.element.y=Math.floor(h.element.y/g)*g;h.screen_x=Math.abs(h.element.x);h.screen_y=Math.abs(h.element.y);var f=this._multipleScreen(h.speed,h.screen_x,h.screen_y);h.screen_x=f.x;h.screen_y=f.y;this.update()},_multipleScreen:function(d,a,f){var e=this.tile_w/d;var b=this.tile_h/d;a=Math.floor(a/e)*e;f=Math.floor(f/b)*b;return{x:a,y:f}},update:function(){var b,e;var f=this.scene.getCanvas();if(this.freeze){return}if(!this.main_el){return}for(var g=0;g<this.scroll_el.length;g++){b=this.scroll_el[g];e={x:b.element.x,y:b.element.y};b.screen_x=this.main_el.x-f.width/2+(f.width/2%this.tile_w);b.screen_y=this.main_el.y-f.height/2+(f.height/2%this.tile_h);var k=Math.abs(e.x);var h=Math.abs(e.y);var d=b.speed;var a=b.speed;if(b.parallax){if(b.screen_x!=b.parallax_x){if(b.screen_x>b.parallax_x){e.x-=d}else{e.x+=d}b.parallax_x=b.screen_x}if(b.screen_y!=b.parallax_y){if(b.screen_y>b.parallax_y){e.y-=a}else{e.y+=a}b.parallax_y=b.screen_y}}else{if(k!=b.screen_x){if(b.screen_x>k){if(k>b.screen_x-d){e.x=-b.screen_x}else{e.x-=d}}else{if(b.screen_x<k){if(k<b.screen_x+d){e.x=-b.screen_x}else{e.x+=d}}}}if(h!=b.screen_y){if(b.screen_y>h){if(h>b.screen_y-a){e.y=-b.screen_y}else{e.y-=a}}else{if(b.screen_y<h){if(h<b.screen_y+a){e.y=-b.screen_y}else{e.y+=a}}}}}if(b.block){if(e.x>0){b.screen_x=e.x=0}else{if(e.x+b.width<f.width){e.x=f.width-b.width;e.x=this._multipleScreen(b.speed,e.x,0).x;b.screen_x=Math.abs(e.x)}}if(e.y>0){b.screen_y=e.y=0}else{if(e.y+b.height<f.height){e.y=f.height-b.height;e.y=this._multipleScreen(b.speed,0,e.y).y;b.screen_y=Math.abs(e.y)}}}if(f.width<=b.width){b.element.x=e.x>>0}if(f.height<=b.height){b.element.y=e.y>>0}}},mouseScroll:function(f,e,d){d=d||{};if(e.height<f.height){f.append(e);return this}var a={};var b=this;e._forceEvent=true;f.beginPath();f.rect(0,0,f.width,f.height);f.clip();f.closePath();e.rect(0,0,e.width,e.height);e.on("dragstart",function(g){a=this.offset();a.time=new Date().getTime();if(d.dragstart){d.dragstart.call(this,g)}});e.on("drag",function(g){if(g.direction=="up"||g.direction=="left"){g.distance=-g.distance}var i=1,h;h=a.top+g.distance*i;if(h>=0){h=0;if(d.onTop){d.onTop.call(this,g)}}else{if(f.height>=(h+this.height)){h=-this.height+f.height;if(d.onBottom){d.onBottom.call(this,g)}}}this.y=h;if(d.drag){d.drag.call(this,g)}});e.on("dragend",function(g){if(d.dragend){d.dragend.call(this,g)}});f.append(e);return this}});var Scrolling={Scrolling:{New:function(){return this["new"].apply(this,arguments)},"new":function(d,b,a){return Class["new"]("Scrolling",[d,b,a])}}};Class.create("Spritesheet",{image:null,_set:{},initialize:function(a,b){this.image=a;if(b){this.set(b)}},set:function(n){var k,a,m,l,h,g,f=Global_CE.Materials.get(this.image,"image");if(!f){return false}for(var b in n){if(b=="grid"){for(var e=0;e<n.grid.length;e++){for(var d=0;d<n.grid[e].set.length;d++){a=n.grid[e].set[d];k=n.grid[e];if(!k.tile){k.tile=[f.width/k.size[0],f.height/k.size[1]]}l=k.tile[1]*parseInt(d/Math.round(k.size[0]));m=k.tile[0]*(d%Math.round(k.size[0]));if(!k.reg){k.reg=[0,0]}h=k.reg[0]||+"0";g=k.reg[1]||+"0";this._set[a]=[m,l,k.tile[0],k.tile[1],0,h,g]}}}else{this._set[b]=n[b]}}},exist:function(a){return this._set[a]?true:false},draw:function(e,i,b){b=b||{};var f=this._set[i];if(!f){throw"Spritesheet "+i+" don't exist"}var h=+(b.x||"0")-f[5],g=+(b.y||"0")-f[6],a=b.w||f[2],d=b.h||f[3];e.drawImage(this.image,f[0],f[1],f[2],f[3],h,g,a,d)},pattern:function(d,f,a){if(!this._set[f]){throw"Spritesheet "+f+" don't exist"}var e=this._set[f],b=Global_CE.Materials.cropImage(this.image,e[0],e[1],e[2],e[3]);pattern=d.getScene().getCanvas().createPattern(b,a);d.fillStyle=pattern}});var Spritesheet={Spritesheet:{New:function(){return this["new"].apply(this,arguments)},"new":function(a,b){return Class["new"]("Spritesheet",[a,b])}}};Class.create("Window",{border:null,width:0,height:0,bitmap:null,el:null,_content:null,_borders:{},_border_size:{width:0,height:0},initialize:function(e,d,a,b){this.width=d;this.height=a;this.border=b;this.scene=e;if(b){this.border_img=Global_CE.Materials.get(b);this._construct()}else{this.el=this.scene.createElement(this.width,this.height);this._content=this.scene.createElement();this.el.append(this._content)}},_construct:function(){if(!Global_CE.Spritesheet){throw"Add Spritesheet class to use windows"}var f=["corner_upleft","up","corner_upright","left","center","right","corner_bottomleft","bottom","corner_bottomright"],e,a;this.el=this.scene.createElement(this.width,this.height);this._border_size.width=this.border_img.width/3;this._border_size.height=this.border_img.height/3;this.spritesheet=Global_CE.Spritesheet["new"](this.border,{grid:[{size:[3,3],tile:[this._border_size.width,this._border_size.height],set:f}]});this._content=this.scene.createElement();for(var d=0;d<f.length;d++){a=f[d];e=this._borders[a]=this.scene.createElement();if(/^corner/.test(a)){this.spritesheet.draw(e,a)}else{this.spritesheet.pattern(e,a)}this.el.append(e)}this._borders.center.zIndex(0);this.el.append(this._content);this.size(this.width,this.height)},size:function(e,a){var f=this._border_size.width,d=this._border_size.height;function b(g){return(g<0?0:g)}this._borders.up.x=f-1;this._borders.up.fillRect(0,0,e+1-f*2,d);this._borders.corner_upright.x=e-f;this._borders.left.y=d;this._borders.left.fillRect(0,0,f,b(a-d*2));this._borders.right.x=e-f;this._borders.right.y=d;this._borders.right.fillRect(0,0,f,b(a-d*2));this._borders.corner_bottomleft.y=a-d;this._borders.bottom.x=f-1;this._borders.bottom.y=a-d;this._borders.bottom.fillRect(0,0,b(e+1-f*2),d);this._borders.corner_bottomright.x=e-f;this._borders.corner_bottomright.y=a-d;this._borders.center.x=this._content.x=f-1;this._borders.center.y=this._content.y=d;this._borders.center.fillRect(0,0,b(e+3-f*2),b(a-d*2));this.el.width=e;this.el.height=a;this.el.setOriginPoint("middle");return this},position:function(b,e){var a=this.scene.getCanvas(),d;if(b===undefined){return{x:this.el.x,y:this.el.y}}if(e===undefined){if(b=="middle"){this.el.x=a.width/2-this.width/2;this.el.y=a.height/2-this.height/2}else{if(b=="bottom"){this.el.x=a.width/2-this.width/2;this.el.y=a.height-this.height-(a.height*0.03)}else{if(b=="top"){this.el.x=a.width/2-this.width/2;this.el.y=a.height*0.03}else{if(d=b.match(/top+([0-9]+)/)){this.el.x=a.width/2-this.width/2;this.el.y=d[1]}else{if(d=b.match(/bottom-([0-9]+)/)){this.el.x=a.width/2-this.width/2;this.el.y=a.height-d[1]}}}}}}else{this.el.x=b;this.el.y=e}return this},setBackground:function(a,e,b){var d;if(!e){e=0}b=b||1;d=this._borders.center;d.x=e;d.y=e;d.fillStyle=a;d.opacity=b;d.fillRect(0,0,this.width-e*2,this.height-e*2);return this},getBox:function(){return this.el},getContent:function(){return this._content},open:function(a){a.append(this.el);return this},remove:function(){this.el.remove();return this},cursor:{array_elements:null,el:null,index:0,params:{},_enable:true,init:function(a,b,d){if(a instanceof Array){b=a;a=null}this.params=CanvasEngine.extend(this.params,d);this.array_elements=b;this.el=a;this.update();return this},refresh:function(a,b){this.array_elements=a;this.setIndex(this.index,b);this.update();return this},remove:function(){this.el.remove();return this},assignKeys:function(e){var b=this;if(e){Global_CE.Input.reset()}Global_CE.Input.press([Input.Up],function(){if(!b._enable){return}b.setIndex(b.index-1)});Global_CE.Input.press([Input.Bottom],function(){if(!b._enable){return}b.setIndex(b.index+1)});function f(){if(!b._enable){return}var g=b.array_elements[b.index];if(b._select&&g){b._select.call(b,g)}}Global_CE.Input.press(this.params.enter,f);function a(g){var h=this.array_elements[g];if(h.width&&h.height&&this._enable){h.forceEvent();h.on("touch",function(){b.setIndex(g);b.update();f()})}}for(var d=0;d<this.array_elements.length;d++){a.call(this,d)}return this},getCurrentElement:function(){return this.array_elements[this.index]},setIndex:function(a,d){var b=this.array_elements.length;if(a<0){a=this.params.reverse?b-1:0}else{if(a>=b){a=this.params.reverse?0:b-1}}this.index=a;this.update(true);return true},update:function(a){if(this.el){if(this.array_elements.length==0){this.el.hide();return}else{this.el.show()}}var b=this.getCurrentElement(),d;if(b){d=b.position();if(this.el){this.el.x=d.left;this.el.y=d.top}if(a&&this._onchange&&this.array_elements.length>0){this._onchange.call(this,b)}}},enable:function(a){if(a!=undefined){this._enable=a;if(a){this.assignKeys()}else{Global_CE.Input.reset([Input.Enter,Input.Up,Input.bottom])}}return this._enable},change:function(a){this._onchange=a;return this},select:function(a){this._select=a;return this}}});var Window={Window:{New:function(){return this["new"].apply(this,arguments)},"new":function(e,d,a,b){return Class["new"]("Window",[e,d,a,b])}}};if(typeof exports!="undefined"){var CE=require("canvasengine").listen(),CanvasEngine=false,Class=CE.Class}Class.create("Point",{initialize:function(b,a){this.x=b;this.y=a}});Class.create("Polygon",{initialize:function(a){this.points=[];this.center=a},addPoint:function(a){this.points.push(a)},addAbsolutePoint:function(a){this.points.push({x:a.x-this.center.x,y:a.y-this.center.y})},getNumberOfSides:function(){return this.points.length},rotate:function(b){for(var d=0;d<this.points.length;d++){var a=this.points[d].x;var e=this.points[d].y;this.points[d].x=Math.cos(b)*a-Math.sin(b)*e;this.points[d].y=Math.sin(b)*a+Math.cos(b)*e}},containsPoint:function(a){var l=this.points.length;var n=a.x;var m=a.y;var g=new Array();for(var b=0;b<this.points.length;b++){g.push(this.points[b].x+this.center.x)}var f=new Array();for(var k=0;k<this.points.length;k++){f.push(this.points[k].y+this.center.y)}var e,d=0;var h=false;for(e=0,d=l-1;e<l;d=e++){if(((f[e]>m)!=(f[d]>m))&&(n<(g[d]-g[e])*(m-f[e])/(f[d]-f[e])+g[e])){h=!h}}return h},intersectsWith:function(g){var f=Class.New("Point");var w,p,n,m,l;var e,v;var b=null;var a=99999999;for(e=0;e<this.getNumberOfSides();e++){if(e==0){f.x=this.points[this.getNumberOfSides()-1].y-this.points[0].y;f.y=this.points[0].x-this.points[this.getNumberOfSides()-1].x}else{f.x=this.points[e-1].y-this.points[e].y;f.y=this.points[e].x-this.points[e-1].x}w=Math.sqrt(f.x*f.x+f.y*f.y);f.x/=w;f.y/=w;p=n=this.points[0].x*f.x+this.points[0].y*f.y;for(v=1;v<this.getNumberOfSides();v++){w=this.points[v].x*f.x+this.points[v].y*f.y;if(w>n){n=w}else{if(w<p){p=w}}}w=this.center.x*f.x+this.center.y*f.y;p+=w;n+=w;m=l=g.points[0].x*f.x+g.points[0].y*f.y;for(v=1;v<g.getNumberOfSides();v++){w=g.points[v].x*f.x+g.points[v].y*f.y;if(w>l){l=w}else{if(w<m){m=w}}}w=g.center.x*f.x+g.center.y*f.y;m+=w;l+=w;if(n<m||p>l){return false}else{var r=(n>m?n-m:l-p);if(r<a){a=r;b={x:f.x,y:f.y}}}}for(e=0;e<g.getNumberOfSides();e++){if(e==0){f.x=g.points[g.getNumberOfSides()-1].y-g.points[0].y;f.y=g.points[0].x-g.points[g.getNumberOfSides()-1].x}else{f.x=g.points[e-1].y-g.points[e].y;f.y=g.points[e].x-g.points[e-1].x}w=Math.sqrt(f.x*f.x+f.y*f.y);f.x/=w;f.y/=w;p=n=this.points[0].x*f.x+this.points[0].y*f.y;for(v=1;v<this.getNumberOfSides();v++){w=this.points[v].x*f.x+this.points[v].y*f.y;if(w>n){n=w}else{if(w<p){p=w}}}w=this.center.x*f.x+this.center.y*f.y;p+=w;n+=w;m=l=g.points[0].x*f.x+g.points[0].y*f.y;for(v=1;v<g.getNumberOfSides();v++){w=g.points[v].x*f.x+g.points[v].y*f.y;if(w>l){l=w}else{if(w<m){m=w}}}w=g.center.x*f.x+g.center.y*f.y;m+=w;l+=w;if(n<m||p>l){return false}else{var r=(n>m?n-m:l-p);if(r<a){a=r;b={x:f.x,y:f.y}}}}function h(i,k){return{x:k.x+i.center.x,y:k.y+i.center.y}}var z,y,q=[],d=[],u=0;function t(D,o,k){var C,B,A,i,E=[];for(C=0;C<g.getNumberOfSides();C++){B=h(g,g.points[C]);A=h(g,g.points[C+1]?g.points[C+1]:g.points[0]);i=Polygon.intersectLineLine(o,k,B,A);if(i=="Coincident"){E.push({sides:C})}d[u].push(i)}u++;return E}for(v=0;v<this.getNumberOfSides();v++){d[u]=[];z=h(this,this.points[v]);y=h(this,this.points[v+1]?this.points[v+1]:this.points[0]);q.push(t(null,z,y))}return{overlap:a+0.001,axis:b,lines:d,coincident:q}}});var Polygon={};Polygon.intersectLineLine=function(f,d,k,i){var g=(i.x-k.x)*(f.y-k.y)-(i.y-k.y)*(f.x-k.x);var h=(d.x-f.x)*(f.y-k.y)-(d.y-f.y)*(f.x-k.x);var e=(i.y-k.y)*(d.x-f.x)-(i.x-k.x)*(d.y-f.y);if(e!=0){var b=g/e;var a=h/e;if(0<=b&&b<=1&&0<=a&&a<=1){return{x:f.x+b*(d.x-f.x),y:f.y+b*(d.y-f.y)}}else{return false}}else{if(g==0||h==0){return"Coincident"}else{return"Parallel"}}};Class.create("EntityModel",{x:0,y:0,_memorize:{x:0,y:0},hitState:{over:0,out:0},_polygon:{},_frame:"0",position:function(a,d){if(a!==undefined&&d!==undefined){this.x=a;this.y=d;var b=this._polygon[this._frame];if(b){b.center.x=this.x;b.center.y=this.y}}return{x:this.x,y:this.y}},savePosition:function(){this._memorize.x=this.x;this._memorize.y=this.y},restorePosition:function(){this.x=this._memorize.x;this.y=this._memorize.y},polygon:function(d){if(d instanceof Array){d={"0":d}}for(var b in d){this._polygon[b]=Class.New("Polygon",[{x:d[b][0][0],y:d[b][0][1]}]);for(var a=0;a<d[b].length;a++){this._polygon[b].addPoint({x:d[b][a][0],y:d[b][a][1]})}}},rect:function(a,e,b,d){if(!b&&!d){b=a;d=e;a=0;e=0}if(!d){d=b}this.polygon([[a,e],[a+b,e],[a+b,e+d],[a,e+d]])},hit:function(b){var a=this._polygon[this._frame].intersectsWith(b._polygon[b._frame]);this.hitState.result=a;if(a){this.hitState.out=0;this.hitState.over++}else{if(this.hitState.over>0){this.hitState.out=1;this.hitState.over=0}else{this.hitState.out=0;this.hitState.over=0}}return this.hitState},getPoints:function(a){a=a||this._frame;return this._polygon[a].points},getPolygonReg:function(a){a=a||this._frame;return this._polygon[a].center},getPolygon:function(a){a=a||this._frame;return this._polygon[a]},frame:function(a){if(a){this._frame=a}return this._frame},});Class.create("Entity",{stage:null,params:{},el:null,mode:null,hit_entities:[],initialize:function(b,d,a){if(a===undefined){a=true}this.stage=b;this.params=d;this.el=this.stage.getScene().createElement();if(a){this.setModel(Class.New("EntityModel"))}this.testHit()},setModel:function(a){this.model=a},position:function(a,e,b){var d=this.model.position(a,e);if(a!==undefined){this.el.x=d.x;this.el.y=d.y}return{x:d.y,y:d.y}},move:function(a,d){var b=this.model.position();if(!a){a=0}if(!d){d=0}return this.position(a+b.x,d+b.y,true)},polygon:function(a){this.model.polygon(a)},rect:function(a,e,b,d){this.model.rect(a,e,b,d);this.el.width=b;this.el.height=d},onHit:function(a,b,d){this.hit_entities=this.hit_entities.concat(b);this.el.on("entity:hit:"+a,d)},testHit:function(){var a=this;this.el.attr("entity:testHit",function(){a.hit(a.hit_entities)})},testAnimHit:function(){var a=this;this.el.on("animation:draw",function(b){})},hit:function(f,g){var e,a=this;function b(h){if(g){g.call(a,h,a.el)}a.el.trigger("entity:hit:"+h,[a.el])}for(var d=0;d<f.length;d++){e=this.model.hit(f[d].model);if(e.over==1){b("over")}else{if(e.out==1){b("out")}}}}});var Matrix={};Class.create("Grid",{_rows:0,_cols:0,cell:{width:0,height:0,prop:[],},_matrix:null,_transform:null,_func:null,initialize:function(a,b){if(a instanceof Array){this._matrix=a;this.cell.prop=a;b=a[0].length;a=a.length}this._rows=a;this._cols=b},transform:function(a){this._func=a},convert:function(a,b){if(!this._func){return{x:a,y:b}}return this._func.call(this,a,b)},setPropertyCell:function(a){if(typeof(PF)!="undefined"){this._pf_grid=false;this._pf_prop=(CanvasEngine||CE.Core).rotateMatrix(a)}this.cell.prop=a},getPropertyByCell:function(a,b){if(!this.cell.prop[a]){return undefined}return this.cell.prop[a][b]},setPropertyByCell:function(a,b,d){if(!this.cell.prop[a]){return undefined}this.cell.prop[a][b]=d;if(typeof(PF)!="undefined"){this._pf_grid=false;this._pf_prop=(CanvasEngine||CE.Core).rotateMatrix(this.cell.prop)}return this},getPropertyByPos:function(b,d){var a=this.getCellByPos(b,d);return this.getPropertyByCell(a.col,a.row)},testCell:function(l,h,f){f=f||{};if(!h.getPolygon){h=h.model}var n=[],b=h.getPolygon(),m=this;function g(o,p){return{x:p.x+o.center.x,y:p.y+o.center.y}}function e(w,q,p,o){var u,A,y,C=[],t=0,B,r=[],z=null,v={};for(u=0;u<o.getNumberOfSides();u++){A=g(o,o.points[u]);y=g(o,o.points[u+1]?o.points[u+1]:o.points[0]);B=Polygon.intersectLineLine(q,p,A,y);if(B=="Coincident"){if(q.x==A.x&&q.y==A.y){z={x:q.x,y:q.y}}else{if(p.x==y.x&&p.y==y.y){z={x:p.x,y:p.y}}else{if(q.x==y.x&&q.y==y.y){z={x:q.x,y:q.y}}else{if(p.x==A.x&&p.y==A.y){z={x:p.x,y:p.y}}}}}r.push({sides:u,points:z})}}if(true){return r}else{v[w]=r;return v}}function k(o){return{x:o.x*m.cell.width,y:o.y*m.cell.height}}if(!l.getPolygon){h=h.model}var i=[{y:l.row,x:l.col},{y:l.row,x:l.col+1},{y:l.row+1,x:l.col+1},{y:l.row+1,x:l.col}];var d,a;for(j=0;j<i.length;j++){d=k(i[j]);a=k(i[j+1]?i[j+1]:i[0]);n.push(e(null,d,a,b))}return n},getEntityCells:function(k,g){var l,h,d,q,e,a,n,m,b=[],t={min_x:99999999,max_x:0,min_y:99999999,max_y:0};g=g||{};if(k.model){q=k.model.getPoints();e=k.model.getPolygonReg();a=k.model.getPolygon()}else{q=k.getPoints();e=k.getPolygonReg();a=k.getPolygon()}for(l=0;l<q.length;l++){d=q[l];n=d.x+e.x;m=d.y+e.y;if(n<t.min_x){t.min_x=n}if(n>t.max_x){t.max_x=n}if(m<t.min_y){t.min_y=m}if(m>t.max_y){t.max_y=m}}var o=[this.getCellByPos(t.min_x,t.min_y),this.getCellByPos(t.max_x,t.min_y),this.getCellByPos(t.max_x,t.max_y),this.getCellByPos(t.min_x,t.max_y)];var f=o[2].row-o[0].row,r=o[1].col-o[0].col;for(l=0;l<r-1;l++){for(h=0;h<f-1;h++){o.push({row:o[0].row+h,col:o[0].col+l})}}return{cells:o}},getCellByPos:function(a,e){if(this.cell.width==0||this.cell.height==0){throw"Set the size of the cell prior with setCellSize method"}var b=Math.floor(this.convert(a,e).x/this.cell.width),d=Math.floor(this.convert(a,e).y/this.cell.height);return{col:b,row:d}},setCellSize:function(a,b){this.cell.width=a;this.cell.height=b},getRows:function(){return this._rows},getCols:function(){return this._cols},getNbCell:function(){return this.getRows()*this.getCols()},passableCell:function(h,g,t,o){o=o||[];var k=this._cols;var z=this._rows;var m=this.cell.prop;var p=[];function d(){for(var E=0;E<k*2+1;E++){p[E]=[];for(var D=0;D<k*2+1;D++){p[E][D]=-1}}var y=Math.floor(p.length/2);p[y][y]=0}var A=[];var b=[[h,g]];var l=0;var f=b[0][0]-k;var e=b[0][1]-k;var B=[];var n=0;d();function w(i,E){for(var D=0;D<o.length;D++){if(o[D][0]==i&&o[D][1]==E){return true}}return false}while(!b.length==0&&l<t){A=[];for(var r=0;r<b.length;r++){var v=b[r][0];var u=b[r][1];var a=v;var C=u;for(var q=0;q<4;q++){switch(q){case 0:if(m[v][u+1]!=undefined&&m[v][u+1]==n&&!w(v,u+1)&&p[a][C+1]==-1){A.push([v,u+1]);B.push([v,u+1]);p[a][C+1]=0}break;case 1:if(m[v+1]!=undefined&&m[v+1][u]!=undefined&&m[v+1][u]==n&&!w(v+1,u)&&p[a+1][C]==-1){A.push([v+1,u]);B.push([v+1,u]);p[a+1][C]=0}break;case 2:if(m[v][u-1]!=undefined&&m[v][u-1]==n&&!w(v,u-1)&&p[a][C-1]==-1){A.push([v,u-1]);B.push([v,u-1]);p[a][C-1]=0}break;case 3:if(m[v-1]!=undefined&&m[v-1][u]!=undefined&&m[v-1][u]==n&&!w(v-1,u)&&p[a-1][C]==-1){A.push([v-1,u]);B.push([v-1,u]);p[a-1][C]=0}break}}}b=A;l+=1}return B},pathfinding:function(d,g,b,f,e,a){e=e||"AStarFinder";if(!this._pf_grid){this._pf_grid=new PF.Grid(this._rows,this._cols,this._pf_prop)}if(d===undefined){return this._pf_grid}return new PF[e](a).findPath(d,g,b,f,this._pf_grid.clone())}});var Hit={Grid:{"new":function(a,b){return Class.New("Grid",[a,b])}}};if(typeof exports!="undefined"){exports.Class=Hit}Class.create("Effect",{scene:null,el:null,canvas:null,initialize:function(b,a){this.scene=b;this.el=a;this.canvas=this.scene.getCanvas();if(!Global_CE.Timeline){throw"Add Timeline class to use effects"}return this},screenFlash:function(a,f,g){var d=this.scene.createElement(),b=this.scene.getCanvas();d.fillStyle=a;d.fillRect(0,0,b.width,b.height);d.opacity=0.8;this.scene.getStage().append(d);d.zIndex(-1);var e=Global_CE.Timeline["new"](d);e.to({opacity:"0"},f).call(function(){d.remove();if(g){g()}})},blink:function(d,b,f){var e=0;var a=function(){d--;e++;if(e>=b){e=0;this.toggle()}if(d<=0){this.off("canvas:render",a);this.show();if(f){f()}}};this.el.on("canvas:render",a)},shake:function(d,e,h,b,i){if(typeof b=="function"){i=b;b=false}var g=0,f=1;b=b||"x";var a=function(){var k=(d*e*f)/10;if(h<=1&&g*(g+k)<0){g=0}else{g+=k}if(g>d*2){f=-1}if(g<-d*2){f=1}if(h>=1){h-=1}if(/x/.test(b)){this.x=g}if(/y/.test(b)){this.y=g}if(h==0){this.off("canvas:render",a);if(i){i()}}console.log(k)};this.el.on("canvas:render",a)},changeScreenColorTone:function(a,e,g,d,f){var b=false;if(this.tone){this.tone.remove();delete this.tone;b=true;if(a=="reset"){return}}this.tone=this.scene.createElement(),canvas=this.scene.getCanvas();this.tone.fillStyle=a;this.tone.fillRect(0,0,canvas.width,canvas.height);this.tone.opacity=0;this.tone.globalCompositeOperation=g;this.scene.getStage().append(this.tone);this.tone.zIndex(-1);if(!b){this.tone.opacity=0;if(e>0){Global_CE.Timeline["new"](this.tone).to({opacity:d},e).call(f)}else{this.tone.opacity=d}}},_weather:function(i,b){if(b.intensity=="stop"){clearInterval(this._weather_.timer);this._weather_.state="stop";return}var a=b.intensity||100;var e=0;var f=this.scene.getStage(),m=this;this._weather_={number:0,numberStop:0,state:"loop"};var k=this.el.width||this.canvas.width,d=this.el.height||this.canvas.height;var l=setInterval(function(){if(m._weather_.number==a){clearInterval(l);return}var n=m.scene.createElement();n.x=CanvasEngine.random(0,k);n.y=-10;var h;if(i=="rain"){n.attr("drift",0);n.attr("speed",CanvasEngine.random(4,6))*8;n.width=n.height=CanvasEngine.random(2,6)*5;h=m.canvas.createRadialGradient(n.height/2,n.height/2,0,n.height/2,n.height/2,n.height);h.addColorStop(0,"rgba(125, 125, 255, 1)");h.addColorStop(1,"rgba(125, 125, 255, 0)");n.beginPath();n.moveTo(0,0);n.lineTo(e,n.height);n.strokeStyle=h;n.stroke()}else{if(i="snow"){n.attr("drift",Math.random());n.attr("speed",CanvasEngine.random(1,6));n.width=n.height=CanvasEngine.random(2,6);if(b.use_gradient){h=m.canvas.createRadialGradient(0,0,0,0,0,n.width);h.addColorStop(0,"rgba(255, 255, 255, 1)");h.addColorStop(1,"rgba(255, 255, 255, 0)")}else{h="white"}n.fillStyle=h;n.fillCircle()}}n.name="weather";m.el.append(n);m._weather_.number++},200);this._weather_.timer=l;var g=function(h){if(h.name!="weather"){return}if(m._weather_.state=="finish"){m.el.empty();m.el.off("canvas:refresh",g);return}if(h.attr("flake_state")=="stop"){return}if(h.y<d){h.y+=h.attr("speed")}if(h.y>d-3){h.y=i=="snow"?-5:-30;if(m._weather_.state=="stop"){h.attr("flake_state","stop");m._weather_.numberStop++;if(m._weather_.number==m._weather_.numberStop){m._weather_.state="finish"}return}}h.x+=h.attr("drift");if(h.x>k){h.x=0}};this.el.on("canvas:refresh",g);return this},rain:function(a){return this._weather("rain",{intensity:a})},snow:function(a,b){return this._weather("snow",{intensity:a,use_gradient:b})},storm:function(a,f,d){var b=this;d=d||"#FCFFE6";this.rain(a);if(a=="stop"){return this}function e(){var g=CanvasEngine.random(4,10);setTimeout(function(){if(b._weather_.state=="loop"){if(f){f()}b.screenFlash(d,10);e()}},g*1000)}e()},particles:function(){}});var Effect={Effect:{New:function(){return this["new"].apply(this,arguments)},"new":function(b,a){return Class["new"]("Effect",[b,a])}}};Class.create("Text",{scene:null,text:"",el:null,_family:null,_style:{size:"20px",family:"Arial",weight:"normal",style:"normal",variant:"normal",color:"#000",transform:"none",decoration:"none",border:"none",lineHeight:25,shadow:null,textBaseline:"alphabetic",lineWidth:null},lines:[],initialize:function(a,b){this.scene=a;this.construct(b)},construct:function(a){a=""+a;this.el=this.scene.createElement();a=this._transformHTML(a);this.text=a.split("\n");this.lines=[]},_transformHTML:function(a){a=a.replace(/<br>/g,"\n");return a},setImageText:function(d,g,b,a){var e=this.scene.createElement();if(!Global_CE.Spritesheet){throw"Add Spritesheet class to use setImageText method"}a=a||{rows:1,cols:1};var f=Global_CE.Spritesheet.New(d,{grid:[{size:a,tile:[b.width,b.height],set:g}]});this._family=f},style:function(b){if(b.size&!b.lineHeight){b.lineHeight=b.size}for(var a in b){this._style[a]=b[a]}return this},draw:function(k,m,l,t){if(t&&!Global_CE.Timeline){throw"Add Timeline class to use effects"}if(!t){t={}}if(!m){m=0}if(!l){l=0}var q=this._style,B,p,A,a=0,h,g="",f;var d=this.scene.getCanvas(),u=this;this.el.x=m;this.el.y=l;function C(y,i,n){h=parseInt(q.lineHeight);h*=parseInt(q.size)/20;a=h*y;i.font=q.style+" "+q.weight+" "+q.variant+" "+q.size+" "+q.family;i.fillStyle=q.color;i.textBaseline=q.textBaseline;if(q.shadow){f=q.shadow.match(/(-?[0-9]+) (-?[0-9]+) ([0-9]+) ([#a-zA-Z0-9]+)/);if(f){i.shadowOffsetX=f[1];i.shadowOffsetY=f[2];i.shadowBlur=f[3];i.shadowColor=f[4]}}i.fillText(n,0,a);if(q.border!="none"){B=q.border.match(/([0-9]+)px ([#a-zA-Z0-9]+)/);i.font=q.style+" "+q.weight+" "+q.variant+" "+(q.size+B[1])+" "+q.family;i.strokeStyle=B[2];i.strokeText(n,0,a)}return i}function r(y,n){var i=u.scene.createElement();C(y,i,n);u.lines.push({text:n,el:i,chars:[]});i.opacity=0}function b(K,n,H){var L=this.lines[K].el;if(n>=this.lines[K].text.length){H();for(var G=0;G<this.lines[K].chars.length;G++){this.lines[K].chars[G].el.remove()}this.el.append(L);L.opacity=1;this.lines[K].el.opacity=1;if(t._char.onFinish){t._char.onFinish()}return}var F=this.scene.createElement(),I=this.lines[K].text[n],y=d.measureText(I).width,J=this;C(K,F,I);F.x=n*y;F.opacity=0;this.el.append(F);this.lines[K].chars.push({_char:I,el:F});Global_CE.Timeline["new"](F).to({opacity:1},t._char.frames).call(function(){if(t._char.onEffect){t._char.onEffect(I,F)}b.call(J,K,n+1,H)})}function z(y){var i=this,n;if(y>=this.lines.length){if(t.line&&t.line.onFinish){t.line.onFinish()}return}n=this.lines[y].el;if(t.line){this.el.append(n);Global_CE.Timeline["new"](n).to({opacity:1},t.line.frames).call(function(){if(t.line.onEffect){t.line.onEffect(i.lines[y].text,n)}z.call(i,y+1)})}else{if(t._char){b.call(this,y,0,function(){z.call(i,y+1)})}else{n.opacity=1;this.el.append(n);z.call(this,y+1)}}}var A,E,o,v,e=0;for(var D=0;D<this.text.length;D++){p=this.text[D];if(q.lineWidth){o=d.measureText(p,q.size,q.family).width;g="";v=p.split(" ");for(var w=0;w<v.length;w++){E=g+v[w]+" ";A=d.measureText(E,q.size,q.family);o=A.width;if(o>q.lineWidth){r(e,g);g=v[w]+" ";e++}else{g=E}}if(o<q.lineWidth){r(e,g);e++}}else{r(D,p)}}z.call(this,0);k.append(this.el);this.parent=k;this.pos={x:m,y:l};return this},refresh:function(a){if(!this.parent){throw"Use 'draw' method before"}this.parent.empty();this.construct(a);this.draw(this.parent,this.pos.x,this.pos.y);return this},getNumberLines:function(){return this.lines.length}});var Text={Text:{New:function(){return this["new"].apply(this,arguments)},"new":function(a,b){return Class["new"]("Text",[a,b])}}};
(function() {
  $(function() {
    var canvas, materials;
    materials = {
      images: {
        inactive: "images/me/inactive.png",
        raiseLeft: "images/me/raiseLeft.png",
        raiseRight: "images/me/raiseRight.png"
      },
      fonts: {
        google: {
          families: ["Share"]
        }
      }
    };
    canvas = CE.defines("canvas").extend([Animation, Hit, Input]).ready(function() {
      return canvas.Scene.call("Title");
    });
    canvas.Scene.New({
      name: "Title",
      materials: materials,
      ready: function(stage) {
        var pressEnter;
        pressEnter = this.createElement();
        pressEnter.font = '16pt "Share"';
        pressEnter.fillText("PRESS ENTER", 185, 350);
        stage.append(pressEnter);
        return canvas.Input.keyDown(Input.Enter, function() {
          canvas.Input.clearKeys(Input.Enter);
          return canvas.Scene.call("Wait", {
            params: {
              score: 0
            }
          });
        });
      },
      render: function(stage) {
        return stage.refresh();
      }
    });
    canvas.Scene.New({
      name: "Wait",
      materials: materials,
      called: function(stage) {
        this.me = this.createElement();
        this.me.drawImage("inactive", 210, 233);
        return stage.append(this.me);
      },
      ready: function(stage, params) {
        var angle, max, score;
        this.params = params;
        this.time = CE.random(90, 120);
        score = this.params.score;
        if (score >= 3) {
          max = Math.pow(2, score - 3) * 90;
          angle = CE.random(max * 0.8, max);
          return $('#canvas').velocity({
            rotateZ: "" + angle + "deg"
          }, 40 * score + 900, "linear");
        }
      },
      render: function(stage) {
        var isTimeToFight;
        isTimeToFight = (function(_this) {
          return function() {
            if (_this.time === 0) {
              return true;
            } else {
              _this.time -= 1;
              return false;
            }
          };
        })(this);
        if (isTimeToFight()) {
          return canvas.Scene.call("Fight", {
            params: this.params
          });
        } else {
          return stage.refresh();
        }
      }
    });
    canvas.Scene.New({
      name: "Fight",
      materials: materials,
      called: function(stage) {
        this.me = Class.New("Entity", [stage]);
        this.me.rect(60, 15);
        this.me.position(210, 233);
        this.me.el.drawImage("inactive");
        return stage.append(this.me.el);
      },
      ready: function(stage, params) {
        var direction, speed;
        this.state = "inactive";
        this.score = params.score;
        direction = [1, -1][Math.round(Math.random())];
        speed = Math.min(0.7 * this.score + 1, 6);
        this.speed = direction * (this.score * 0.7 + 1);
        this.stateToWin = ["raiseRight", "raiseLeft"][(direction + 1) / 2];
        this.lock = 0;
        this.result = "";
        this.enemy = Class.New("Entity", [stage]);
        this.enemy.rect(7.5);
        this.enemy.position(270 * (1 - direction) - 30, 233);
        this.enemy.el.strokeStyle = "222222";
        this.enemy.el.lineWidth = 2;
        this.enemy.el.strokeCircle(7.5);
        stage.append(this.enemy.el);
        canvas.Input.keyDown(Input.Left, (function(_this) {
          return function() {
            if (_this.lock === 0) {
              _this.state = "raiseLeft";
              return _this.lock = 60;
            }
          };
        })(this));
        return canvas.Input.keyDown(Input.Right, (function(_this) {
          return function() {
            if (_this.lock === 0) {
              _this.state = "raiseRight";
              return _this.lock = 60;
            }
          };
        })(this));
      },
      render: function(stage) {
        if (this.lock === 0) {
          this.state = "inactive";
        } else {
          this.lock -= 1;
        }
        if (this.state === "inactive") {
          this.me.rect(60, 15);
          this.me.position(210, 233);
        } else {
          this.me.rect(100, 15);
          this.me.position(190, 233);
        }
        this.me.el.drawImage(this.state);
        switch (this.result) {
          case "win":
            this.enemy.move(-this.speed, -Math.abs(this.speed));
            if (this.enemy.el.x < -70 || 550 < this.enemy.el.x) {
              canvas.Scene.call("Wait", {
                params: {
                  score: this.score + 1
                }
              });
            }
            break;
          case "lose":
            canvas.Scene.call("Score", {
              params: {
                score: this.score
              }
            });
            break;
          case "":
            this.enemy.move(this.speed);
            this.enemy.hit([this.me], (function(_this) {
              return function(el) {
                return _this.result = (_this.state === _this.stateToWin ? "win" : "lose");
              };
            })(this));
        }
        return stage.refresh();
      }
    });
    return canvas.Scene.New({
      name: "Score",
      materials: materials,
      ready: function(stage, params) {
        var enterToRetry, result, score;
        score = params.score;
        result = this.createElement();
        result.font = '16pt "Share"';
        result.fillText("SCORE: " + score, 200, 200);
        stage.append(result);
        enterToRetry = this.createElement();
        enterToRetry.font = '16pt "Share"';
        enterToRetry.fillText("GAME OVER", 190, 350);
        return stage.append(enterToRetry);
      },
      render: function(stage) {
        return stage.refresh();
      }
    });
  });

}).call(this);

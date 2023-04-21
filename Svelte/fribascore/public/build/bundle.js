
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Header.svelte generated by Svelte v3.46.4 */

    const file$9 = "src\\Header.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t = text(/*nimi*/ ctx[0]);
    			add_location(h1, file$9, 6, 2, 138);
    			attr_dev(div, "class", "header svelte-xga9c1");
    			add_location(div, file$9, 5, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*nimi*/ 1) set_data_dev(t, /*nimi*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { nimi } = $$props;
    	const writable_props = ['nimi'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('nimi' in $$props) $$invalidate(0, nimi = $$props.nimi);
    	};

    	$$self.$capture_state = () => ({ nimi });

    	$$self.$inject_state = $$props => {
    		if ('nimi' in $$props) $$invalidate(0, nimi = $$props.nimi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [nimi];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { nimi: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*nimi*/ ctx[0] === undefined && !('nimi' in props)) {
    			console.warn("<Header> was created without expected prop 'nimi'");
    		}
    	}

    	get nimi() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nimi(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Footer.svelte generated by Svelte v3.46.4 */

    const file$8 = "src\\Footer.svelte";

    function create_fragment$8(ctx) {
    	let footer;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			t0 = text(/*tekija*/ ctx[0]);
    			t1 = text(", ");
    			t2 = text(/*vuosi*/ ctx[1]);
    			attr_dev(footer, "class", "svelte-ua45bb");
    			add_location(footer, file$8, 6, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, t0);
    			append_dev(footer, t1);
    			append_dev(footer, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tekija*/ 1) set_data_dev(t0, /*tekija*/ ctx[0]);
    			if (dirty & /*vuosi*/ 2) set_data_dev(t2, /*vuosi*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let { tekija } = $$props;
    	let { vuosi } = $$props;
    	const writable_props = ['tekija', 'vuosi'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tekija' in $$props) $$invalidate(0, tekija = $$props.tekija);
    		if ('vuosi' in $$props) $$invalidate(1, vuosi = $$props.vuosi);
    	};

    	$$self.$capture_state = () => ({ tekija, vuosi });

    	$$self.$inject_state = $$props => {
    		if ('tekija' in $$props) $$invalidate(0, tekija = $$props.tekija);
    		if ('vuosi' in $$props) $$invalidate(1, vuosi = $$props.vuosi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tekija, vuosi];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { tekija: 0, vuosi: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tekija*/ ctx[0] === undefined && !('tekija' in props)) {
    			console.warn("<Footer> was created without expected prop 'tekija'");
    		}

    		if (/*vuosi*/ ctx[1] === undefined && !('vuosi' in props)) {
    			console.warn("<Footer> was created without expected prop 'vuosi'");
    		}
    	}

    	get tekija() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tekija(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vuosi() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vuosi(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Button.svelte generated by Svelte v3.46.4 */

    const file$7 = "src\\Button.svelte";

    function create_fragment$7(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			button.disabled = /*disabloitu*/ ctx[0];
    			attr_dev(button, "class", "svelte-1te20gk");
    			add_location(button, file$7, 4, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*disabloitu*/ 1) {
    				prop_dev(button, "disabled", /*disabloitu*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { disabloitu = false } = $$props;
    	const writable_props = ['disabloitu'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('disabloitu' in $$props) $$invalidate(0, disabloitu = $$props.disabloitu);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ disabloitu });

    	$$self.$inject_state = $$props => {
    		if ('disabloitu' in $$props) $$invalidate(0, disabloitu = $$props.disabloitu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [disabloitu, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { disabloitu: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get disabloitu() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabloitu(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    // Store käyttäjän tieotjen tallentamista varten
    const kayttaja = writable({ ktun: null });

    const kayttajaMetodit = {
      subscribe: kayttaja.subscribe,
      // metodi joka "kirjaa käyttäjän sisään" eli asettaa ktun arvoksi parametrin
      kirjauduSisaan: (nimi) => {
        kayttaja.set({
          ktun: nimi,
        });
      },

      // "kirjaa ulos" eli asettaa ktun-arvon nulliksi
      loggauduUlos: () => {
        kayttaja.set({ ktun: null });
      },
    };

    /* src\Login.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\Login.svelte";

    // (7:0) {#if !$kayttaja.ktun}
    function create_if_block_2$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Kirjaudu sisään muokataksesi listaa";
    			add_location(p, file$6, 7, 2, 150);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(7:0) {#if !$kayttaja.ktun}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {:else}
    function create_else_block_1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*$kayttaja*/ ctx[1].ktun + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Sisäänkirjautunut nimellä ");
    			t1 = text(t1_value);
    			add_location(p, file$6, 22, 4, 584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$kayttaja*/ 2 && t1_value !== (t1_value = /*$kayttaja*/ ctx[1].ktun + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:2) {#if !$kayttaja.ktun}
    function create_if_block_1$3(ctx) {
    	let input;
    	let input_value_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*$kayttaja*/ ctx[1].ktun;
    			attr_dev(input, "placeholder", "Syötä käyttäjänimesi");
    			attr_dev(input, "id", "ktun");
    			attr_dev(input, "class", "svelte-1m275hg");
    			add_location(input, file$6, 14, 4, 417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[2](input);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$kayttaja*/ 2 && input_value_value !== (input_value_value = /*$kayttaja*/ ctx[1].ktun) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(14:2) {#if !$kayttaja.ktun}",
    		ctx
    	});

    	return block;
    }

    // (32:2) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", kayttajaMetodit.loggauduUlos);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(32:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#if !$kayttaja.ktun}
    function create_if_block$5(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(kayttajaMetodit.kirjauduSisaan(/*userElem*/ ctx[0].value))) kayttajaMetodit.kirjauduSisaan(/*userElem*/ ctx[0].value).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(26:2) {#if !$kayttaja.ktun}",
    		ctx
    	});

    	return block;
    }

    // (34:4) <Button on:click={kayttaja.loggauduUlos}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Kirjaudu ulos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(34:4) <Button on:click={kayttaja.loggauduUlos}>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <Button on:click={kayttaja.kirjauduSisaan(userElem.value)}        >
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Kirjaudu sisään");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(29:4) <Button on:click={kayttaja.kirjauduSisaan(userElem.value)}        >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let current_block_type_index;
    	let if_block2;
    	let current;
    	let if_block0 = !/*$kayttaja*/ ctx[1].ktun && create_if_block_2$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (!/*$kayttaja*/ ctx[1].ktun) return create_if_block_1$3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	const if_block_creators = [create_if_block$5, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*$kayttaja*/ ctx[1].ktun) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div = element("div");
    			if_block1.c();
    			t1 = space();
    			if_block2.c();
    			attr_dev(div, "class", "container svelte-1m275hg");
    			add_location(div, file$6, 12, 0, 363);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			if_block1.m(div, null);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*$kayttaja*/ ctx[1].ktun) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if_block1.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $kayttaja;
    	validate_store(kayttajaMetodit, 'kayttaja');
    	component_subscribe($$self, kayttajaMetodit, $$value => $$invalidate(1, $kayttaja = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let userElem = '';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			userElem = $$value;
    			$$invalidate(0, userElem);
    		});
    	}

    	$$self.$capture_state = () => ({ kayttaja: kayttajaMetodit, Button, userElem, $kayttaja });

    	$$self.$inject_state = $$props => {
    		if ('userElem' in $$props) $$invalidate(0, userElem = $$props.userElem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userElem, $kayttaja, input_binding];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    // Store, jonne tallennetaan pelatut kierrokset

    const tulokset = writable([
      // yksi kierros valmiina, jotta sivulla on jotain dataa jo käynnistettäessä
      { id: 1, rata: 'Hiiska DG', tulos: 58, pvm: '2022-04-20', pelaaja: 'Tommi' },
    ]);

    // Store, jonne tallennetaan ratojen tiedot

    const radat = writable([
      { id: 1, nimi: 'Hiiska DG', par: 61, vaylat: 18 },
      {
        id: 2,
        nimi: 'Liikuntapuiston Frisbeegolfrata Äänekoski',
        par: 57,
        vaylat: 18,
      },
      {
        id: 3,
        nimi: 'Suolahden Frisbeegolfrata',
        par: 55,
        vaylat: 18,
      },
      {
        id: 4,
        nimi: 'Laajalahden Frisbeegolfrata',
        par: 32,
        vaylat: 10,
      },
    ]);

    /* src\Tuloskortti.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\Tuloskortti.svelte";

    // (36:4) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*erotus*/ ctx[7]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(36:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:11) {#if erotus > 0}
    function create_if_block_1$2(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("+");
    			t1 = text(/*erotus*/ ctx[7]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(34:11) {#if erotus > 0}",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#if $kayttaja.ktun}
    function create_if_block$4(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*poista*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(44:2) {#if $kayttaja.ktun}",
    		ctx
    	});

    	return block;
    }

    // (45:4) <Button on:click={poista}>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Poista");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(45:4) <Button on:click={poista}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let t2;
    	let img;
    	let img_src_value;
    	let t3;
    	let hr;
    	let t4;
    	let p0;
    	let t5;
    	let t6;
    	let t7;
    	let p1;
    	let t8;
    	let t9;
    	let t10;
    	let p2;
    	let t11;
    	let t12;
    	let p3;
    	let t13;
    	let t14;
    	let t15;
    	let p4;
    	let t16;
    	let t17;
    	let t18;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*erotus*/ ctx[7] > 0) return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*$kayttaja*/ ctx[5].ktun && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text("Kierroksen tunniste: ");
    			t1 = text(/*id*/ ctx[3]);
    			t2 = space();
    			img = element("img");
    			t3 = space();
    			hr = element("hr");
    			t4 = space();
    			p0 = element("p");
    			t5 = text("Rata: ");
    			t6 = text(/*rata*/ ctx[0]);
    			t7 = space();
    			p1 = element("p");
    			t8 = text("Heittojen määrä: ");
    			t9 = text(/*tulos*/ ctx[1]);
    			t10 = space();
    			p2 = element("p");
    			t11 = text("Tulos: ");
    			if_block0.c();
    			t12 = space();
    			p3 = element("p");
    			t13 = text("Päivämäärä: ");
    			t14 = text(/*pvm*/ ctx[2]);
    			t15 = space();
    			p4 = element("p");
    			t16 = text("Pelaaja: ");
    			t17 = text(/*pelaaja*/ ctx[4]);
    			t18 = space();
    			if (if_block1) if_block1.c();
    			add_location(h2, file$5, 22, 2, 674);
    			if (!src_url_equal(img.src, img_src_value = "https://loremflickr.com/320/240/discgolf?id=" + /*id*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "kuvituskuva");
    			attr_dev(img, "class", "svelte-nbgy3n");
    			add_location(img, file$5, 24, 2, 788);
    			add_location(hr, file$5, 28, 2, 885);
    			attr_dev(p0, "class", "svelte-nbgy3n");
    			add_location(p0, file$5, 30, 2, 944);
    			attr_dev(p1, "class", "svelte-nbgy3n");
    			add_location(p1, file$5, 31, 2, 967);
    			attr_dev(p2, "class", "svelte-nbgy3n");
    			add_location(p2, file$5, 32, 2, 1002);
    			attr_dev(p3, "class", "svelte-nbgy3n");
    			add_location(p3, file$5, 39, 2, 1103);
    			attr_dev(p4, "class", "svelte-nbgy3n");
    			add_location(p4, file$5, 40, 2, 1131);
    			attr_dev(div, "class", "tulokset svelte-nbgy3n");
    			add_location(div, file$5, 21, 0, 648);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div, t2);
    			append_dev(div, img);
    			append_dev(div, t3);
    			append_dev(div, hr);
    			append_dev(div, t4);
    			append_dev(div, p0);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			append_dev(div, t7);
    			append_dev(div, p1);
    			append_dev(p1, t8);
    			append_dev(p1, t9);
    			append_dev(div, t10);
    			append_dev(div, p2);
    			append_dev(p2, t11);
    			if_block0.m(p2, null);
    			append_dev(div, t12);
    			append_dev(div, p3);
    			append_dev(p3, t13);
    			append_dev(p3, t14);
    			append_dev(div, t15);
    			append_dev(div, p4);
    			append_dev(p4, t16);
    			append_dev(p4, t17);
    			append_dev(div, t18);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*id*/ 8) set_data_dev(t1, /*id*/ ctx[3]);

    			if (!current || dirty & /*id*/ 8 && !src_url_equal(img.src, img_src_value = "https://loremflickr.com/320/240/discgolf?id=" + /*id*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*rata*/ 1) set_data_dev(t6, /*rata*/ ctx[0]);
    			if (!current || dirty & /*tulos*/ 2) set_data_dev(t9, /*tulos*/ ctx[1]);
    			if_block0.p(ctx, dirty);
    			if (!current || dirty & /*pvm*/ 4) set_data_dev(t14, /*pvm*/ ctx[2]);
    			if (!current || dirty & /*pelaaja*/ 16) set_data_dev(t17, /*pelaaja*/ ctx[4]);

    			if (/*$kayttaja*/ ctx[5].ktun) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$kayttaja*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $radat;
    	let $kayttaja;
    	validate_store(radat, 'radat');
    	component_subscribe($$self, radat, $$value => $$invalidate(8, $radat = $$value));
    	validate_store(kayttajaMetodit, 'kayttaja');
    	component_subscribe($$self, kayttajaMetodit, $$value => $$invalidate(5, $kayttaja = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tuloskortti', slots, []);
    	const dispatch = createEventDispatcher();

    	// customeventti, joka lähettää id:n parametrinä oikean tuloksen poistamiseksi
    	const poista = () => dispatch('poista', id);

    	let { rata } = $$props;
    	let { tulos } = $$props;
    	let { pvm } = $$props;
    	let { id } = $$props;
    	let { pelaaja } = $$props;

    	// lasketaan kierrokset tulos eli heittojen määrä - radan par.
    	let erotus = tulos - $radat.find(obj => obj.nimi === rata).par;

    	const writable_props = ['rata', 'tulos', 'pvm', 'id', 'pelaaja'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tuloskortti> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('rata' in $$props) $$invalidate(0, rata = $$props.rata);
    		if ('tulos' in $$props) $$invalidate(1, tulos = $$props.tulos);
    		if ('pvm' in $$props) $$invalidate(2, pvm = $$props.pvm);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('pelaaja' in $$props) $$invalidate(4, pelaaja = $$props.pelaaja);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		kayttaja: kayttajaMetodit,
    		radat,
    		createEventDispatcher,
    		dispatch,
    		poista,
    		rata,
    		tulos,
    		pvm,
    		id,
    		pelaaja,
    		erotus,
    		$radat,
    		$kayttaja
    	});

    	$$self.$inject_state = $$props => {
    		if ('rata' in $$props) $$invalidate(0, rata = $$props.rata);
    		if ('tulos' in $$props) $$invalidate(1, tulos = $$props.tulos);
    		if ('pvm' in $$props) $$invalidate(2, pvm = $$props.pvm);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('pelaaja' in $$props) $$invalidate(4, pelaaja = $$props.pelaaja);
    		if ('erotus' in $$props) $$invalidate(7, erotus = $$props.erotus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [rata, tulos, pvm, id, pelaaja, $kayttaja, poista, erotus];
    }

    class Tuloskortti extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			rata: 0,
    			tulos: 1,
    			pvm: 2,
    			id: 3,
    			pelaaja: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tuloskortti",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*rata*/ ctx[0] === undefined && !('rata' in props)) {
    			console.warn("<Tuloskortti> was created without expected prop 'rata'");
    		}

    		if (/*tulos*/ ctx[1] === undefined && !('tulos' in props)) {
    			console.warn("<Tuloskortti> was created without expected prop 'tulos'");
    		}

    		if (/*pvm*/ ctx[2] === undefined && !('pvm' in props)) {
    			console.warn("<Tuloskortti> was created without expected prop 'pvm'");
    		}

    		if (/*id*/ ctx[3] === undefined && !('id' in props)) {
    			console.warn("<Tuloskortti> was created without expected prop 'id'");
    		}

    		if (/*pelaaja*/ ctx[4] === undefined && !('pelaaja' in props)) {
    			console.warn("<Tuloskortti> was created without expected prop 'pelaaja'");
    		}
    	}

    	get rata() {
    		throw new Error("<Tuloskortti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rata(value) {
    		throw new Error("<Tuloskortti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tulos() {
    		throw new Error("<Tuloskortti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tulos(value) {
    		throw new Error("<Tuloskortti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pvm() {
    		throw new Error("<Tuloskortti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pvm(value) {
    		throw new Error("<Tuloskortti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Tuloskortti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Tuloskortti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pelaaja() {
    		throw new Error("<Tuloskortti>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pelaaja(value) {
    		throw new Error("<Tuloskortti>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Tuloslista.svelte generated by Svelte v3.46.4 */
    const file$4 = "src\\Tuloslista.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (20:2) {:else}
    function create_else_block(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Ei vielä merkittyjä tuloksia";
    			add_location(h2, file$4, 20, 4, 557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(20:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if $tulokset.length > 0}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$tulokset*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tulokset*/ 1) {
    				each_value = /*$tulokset*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:2) {#if $tulokset.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#each $tulokset as tulos}
    function create_each_block$1(ctx) {
    	let tuloskortti;
    	let current;

    	tuloskortti = new Tuloskortti({
    			props: {
    				id: /*tulos*/ ctx[2].id,
    				rata: /*tulos*/ ctx[2].rata,
    				tulos: /*tulos*/ ctx[2].tulos,
    				pvm: /*tulos*/ ctx[2].pvm,
    				pelaaja: /*tulos*/ ctx[2].pelaaja
    			},
    			$$inline: true
    		});

    	tuloskortti.$on("poista", /*poista_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(tuloskortti.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tuloskortti, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tuloskortti_changes = {};
    			if (dirty & /*$tulokset*/ 1) tuloskortti_changes.id = /*tulos*/ ctx[2].id;
    			if (dirty & /*$tulokset*/ 1) tuloskortti_changes.rata = /*tulos*/ ctx[2].rata;
    			if (dirty & /*$tulokset*/ 1) tuloskortti_changes.tulos = /*tulos*/ ctx[2].tulos;
    			if (dirty & /*$tulokset*/ 1) tuloskortti_changes.pvm = /*tulos*/ ctx[2].pvm;
    			if (dirty & /*$tulokset*/ 1) tuloskortti_changes.pelaaja = /*tulos*/ ctx[2].pelaaja;
    			tuloskortti.$set(tuloskortti_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tuloskortti.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tuloskortti.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tuloskortti, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:4) {#each $tulokset as tulos}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$tulokset*/ ctx[0].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "tulokset svelte-19pb8tc");
    			toggle_class(div, "lista", /*$tulokset*/ ctx[0].length > 2);
    			add_location(div, file$4, 5, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (dirty & /*$tulokset*/ 1) {
    				toggle_class(div, "lista", /*$tulokset*/ ctx[0].length > 2);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $tulokset;
    	validate_store(tulokset, 'tulokset');
    	component_subscribe($$self, tulokset, $$value => $$invalidate(0, $tulokset = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tuloslista', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tuloslista> was created with unknown prop '${key}'`);
    	});

    	function poista_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({ Tuloskortti, tulokset, $tulokset });
    	return [$tulokset, poista_handler];
    }

    class Tuloslista extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tuloslista",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src\Modal.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$3(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let header;
    	let t1;
    	let t2;
    	let footer;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	const header_slot_template = /*#slots*/ ctx[1].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[0], get_header_slot_context);
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	const footer_slot_template = /*#slots*/ ctx[1].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[0], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			header = element("header");
    			if (header_slot) header_slot.c();
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			footer = element("footer");
    			if (footer_slot) footer_slot.c();
    			attr_dev(div0, "class", "backdrop svelte-14eypvu");
    			add_location(div0, file$3, 4, 0, 74);
    			add_location(header, file$3, 13, 2, 353);
    			add_location(footer, file$3, 17, 2, 418);
    			attr_dev(div1, "class", "modal svelte-14eypvu");
    			add_location(div1, file$3, 7, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);

    			if (header_slot) {
    				header_slot.m(header, null);
    			}

    			append_dev(div1, t1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, footer);

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[0], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[0], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			transition_in(footer_slot, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fly, { duration: 1000, y: -300 });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			transition_out(footer_slot, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, scale, { duration: 300 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['header','default','footer']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fly, scale });
    	return [$$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\UusiTulos.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\UusiTulos.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (67:2) {#if !lomakeValidi && !ekaVierailu}
    function create_if_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Heittojen määrä ei voi olla alle radan väylien määrän";
    			attr_dev(p, "class", "error svelte-1ax9wgt");
    			add_location(p, file$2, 67, 4, 2266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(67:2) {#if !lomakeValidi && !ekaVierailu}",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#each $radat as rata}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*rata*/ ctx[17].nimi + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*rata*/ ctx[17].nimi;
    			option.value = option.__value;
    			add_location(option, file$2, 77, 6, 2527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    			/*option_binding*/ ctx[12](option);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$radat*/ 32 && t_value !== (t_value = /*rata*/ ctx[17].nimi + "")) set_data_dev(t, t_value);

    			if (dirty & /*$radat*/ 32 && option_value_value !== (option_value_value = /*rata*/ ctx[17].nimi)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    			/*option_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(77:4) {#each $radat as rata}",
    		ctx
    	});

    	return block;
    }

    // (51:0) <Modal>
    function create_default_slot_2$1(ctx) {
    	let hr;
    	let t0;
    	let label0;
    	let t2;
    	let input0;
    	let t3;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let label2;
    	let t9;
    	let select;
    	let t10;
    	let p;
    	let mounted;
    	let dispose;
    	let if_block = !/*lomakeValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[3] && create_if_block$2(ctx);
    	let each_value = /*$radat*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			t0 = space();
    			label0 = element("label");
    			label0.textContent = "Heittojen määrä";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Päivämäärä";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			label2 = element("label");
    			label2.textContent = "Rata";
    			t9 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			p = element("p");
    			p.textContent = "Eikö rataa näy listassa? Lisää se täältä!";
    			add_location(hr, file$2, 55, 2, 1930);
    			attr_dev(label0, "for", "tulos");
    			attr_dev(label0, "class", "svelte-1ax9wgt");
    			add_location(label0, file$2, 56, 2, 1940);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "id", "tulos");
    			attr_dev(input0, "class", "svelte-1ax9wgt");
    			toggle_class(input0, "inputerror", !/*lomakeValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[3]);
    			add_location(input0, file$2, 57, 2, 1986);
    			attr_dev(label1, "for", "pvm");
    			attr_dev(label1, "class", "svelte-1ax9wgt");
    			add_location(label1, file$2, 70, 2, 2355);
    			attr_dev(input1, "type", "date");
    			attr_dev(input1, "id", "pvm");
    			add_location(input1, file$2, 71, 2, 2394);
    			attr_dev(label2, "for", "rata");
    			attr_dev(label2, "class", "svelte-1ax9wgt");
    			add_location(label2, file$2, 73, 2, 2447);
    			add_location(select, file$2, 75, 2, 2483);
    			attr_dev(p, "class", "info svelte-1ax9wgt");
    			add_location(p, file$2, 80, 2, 2609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*uusiTulos*/ ctx[0]);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, label1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*pvm*/ ctx[1]);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, label2, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			insert_dev(target, t10, anchor);
    			insert_dev(target, p, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input0, "blur", /*blur_handler*/ ctx[10], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(p, "click", /*peruuta*/ ctx[7], false, false, false),
    					listen_dev(p, "click", /*naytaRadanLisays*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*uusiTulos*/ 1 && to_number(input0.value) !== /*uusiTulos*/ ctx[0]) {
    				set_input_value(input0, /*uusiTulos*/ ctx[0]);
    			}

    			if (dirty & /*lomakeValidi, ekaVierailu*/ 24) {
    				toggle_class(input0, "inputerror", !/*lomakeValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[3]);
    			}

    			if (!/*lomakeValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[3]) {
    				if (if_block) ; else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t4.parentNode, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*pvm*/ 2) {
    				set_input_value(input1, /*pvm*/ ctx[1]);
    			}

    			if (dirty & /*$radat, valittuRata*/ 36) {
    				each_value = /*$radat*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(label2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(51:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    // (52:2) 
    function create_header_slot$1(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Syötä kierroksen tiedot";
    			attr_dev(div0, "class", "sulje svelte-1ax9wgt");
    			add_location(div0, file$2, 52, 4, 1833);
    			add_location(h2, file$2, 53, 4, 1884);
    			attr_dev(div1, "slot", "header");
    			add_location(div1, file$2, 51, 2, 1808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h2);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*peruuta*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot$1.name,
    		type: "slot",
    		source: "(52:2) ",
    		ctx
    	});

    	return block;
    }

    // (86:4) <Button on:click={lisaaTulos} disabloitu={!lomakeValidi}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lisää tulos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(86:4) <Button on:click={lisaaTulos} disabloitu={!lomakeValidi}>",
    		ctx
    	});

    	return block;
    }

    // (88:4) <Button on:click={peruuta}>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Peruuta");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(88:4) <Button on:click={peruuta}>",
    		ctx
    	});

    	return block;
    }

    // (85:2) 
    function create_footer_slot$1(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				disabloitu: !/*lomakeValidi*/ ctx[4],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*lisaaTulos*/ ctx[6]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*peruuta*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$2, 84, 2, 2733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*lomakeValidi*/ 16) button0_changes.disabloitu = !/*lomakeValidi*/ ctx[4];

    			if (dirty & /*$$scope*/ 1048576) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot$1.name,
    		type: "slot",
    		source: "(85:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					footer: [create_footer_slot$1],
    					header: [create_header_slot$1],
    					default: [create_default_slot_2$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, lomakeValidi, $radat, valittuRata, pvm, ekaVierailu, uusiTulos*/ 1048639) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let lomakeValidi;
    	let $radat;
    	validate_store(radat, 'radat');
    	component_subscribe($$self, radat, $$value => $$invalidate(5, $radat = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UusiTulos', slots, []);
    	const dispatch = createEventDispatcher();

    	// lisaaTulos lähettää custom-tapahtuman, jonka parametreinä on lomakkeeseen syötetyt tiedot
    	const lisaaTulos = () => dispatch('lisaaTulos', { uusiTulos, rata: valittuRata.value, pvm });

    	const peruuta = () => dispatch('peruuta');
    	const naytaRadanLisays = () => dispatch('naytaRadanLisays');

    	// Asetetaan datepickerin defaultiksi nykyinen päivämäärä ja muotoillaan se käytettävään muotoon
    	const date = new Date();

    	let datestring;

    	if (date.getMonth() > 9) {
    		datestring = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    	} else {
    		datestring = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
    	}

    	let pvm = datestring.toString();
    	let uusiTulos = 0;
    	let valittuRata = 'Hiiska DG';

    	// lomakkeen validoinnit. minVaylienMaara ottaa radat-storesta pienimmän väylien määrän
    	let ekaVierailu = true;

    	// Tehdään mappi, jossa on radat-storen väylien arvot ja valitaan niistä pienin arvo
    	let minVaylienMaara = Math.min(...$radat.map(r => r.vaylat));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UusiTulos> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		uusiTulos = to_number(this.value);
    		$$invalidate(0, uusiTulos);
    	}

    	const blur_handler = () => $$invalidate(3, ekaVierailu = false);

    	function input1_input_handler() {
    		pvm = this.value;
    		$$invalidate(1, pvm);
    	}

    	function option_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			valittuRata = $$value;
    			$$invalidate(2, valittuRata);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Modal,
    		Button,
    		radat,
    		createEventDispatcher,
    		dispatch,
    		lisaaTulos,
    		peruuta,
    		naytaRadanLisays,
    		date,
    		datestring,
    		pvm,
    		uusiTulos,
    		valittuRata,
    		ekaVierailu,
    		minVaylienMaara,
    		lomakeValidi,
    		$radat
    	});

    	$$self.$inject_state = $$props => {
    		if ('datestring' in $$props) datestring = $$props.datestring;
    		if ('pvm' in $$props) $$invalidate(1, pvm = $$props.pvm);
    		if ('uusiTulos' in $$props) $$invalidate(0, uusiTulos = $$props.uusiTulos);
    		if ('valittuRata' in $$props) $$invalidate(2, valittuRata = $$props.valittuRata);
    		if ('ekaVierailu' in $$props) $$invalidate(3, ekaVierailu = $$props.ekaVierailu);
    		if ('minVaylienMaara' in $$props) $$invalidate(16, minVaylienMaara = $$props.minVaylienMaara);
    		if ('lomakeValidi' in $$props) $$invalidate(4, lomakeValidi = $$props.lomakeValidi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*uusiTulos*/ 1) {
    			$$invalidate(4, lomakeValidi = uusiTulos >= minVaylienMaara);
    		}
    	};

    	return [
    		uusiTulos,
    		pvm,
    		valittuRata,
    		ekaVierailu,
    		lomakeValidi,
    		$radat,
    		lisaaTulos,
    		peruuta,
    		naytaRadanLisays,
    		input0_input_handler,
    		blur_handler,
    		input1_input_handler,
    		option_binding
    	];
    }

    class UusiTulos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UusiTulos",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\UusiRata.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\UusiRata.svelte";

    // (47:2) {#if !nimiValidi && !ekaVierailu}
    function create_if_block_2$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Radan nimen täytyy olla vähintään 3 merkkiä pitkä";
    			attr_dev(p, "class", "error svelte-vlhq8p");
    			add_location(p, file$1, 47, 4, 1294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(47:2) {#if !nimiValidi && !ekaVierailu}",
    		ctx
    	});

    	return block;
    }

    // (60:2) {#if !parValidi && !ekaVierailu}
    function create_if_block_1$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Par ei voi olla pienempi kuin väylien lukumäärä";
    			attr_dev(p, "class", "error svelte-vlhq8p");
    			add_location(p, file$1, 60, 4, 1622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(60:2) {#if !parValidi && !ekaVierailu}",
    		ctx
    	});

    	return block;
    }

    // (73:2) {#if !vaylatValidi && !ekaVierailu}
    function create_if_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Radalla täytyy olla vähintään yksi väylä";
    			attr_dev(p, "class", "error svelte-vlhq8p");
    			add_location(p, file$1, 73, 4, 1967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(73:2) {#if !vaylatValidi && !ekaVierailu}",
    		ctx
    	});

    	return block;
    }

    // (31:0) <Modal>
    function create_default_slot_2(ctx) {
    	let hr;
    	let t0;
    	let label0;
    	let t2;
    	let input0;
    	let t3;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let t8;
    	let label2;
    	let t10;
    	let input2;
    	let t11;
    	let if_block2_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*nimiValidi*/ ctx[5] && !/*ekaVierailu*/ ctx[6] && create_if_block_2$1(ctx);
    	let if_block1 = !/*parValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[6] && create_if_block_1$1(ctx);
    	let if_block2 = !/*vaylatValidi*/ ctx[3] && !/*ekaVierailu*/ ctx[6] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			t0 = space();
    			label0 = element("label");
    			label0.textContent = "Radan nimi";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Radan par";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			if (if_block1) if_block1.c();
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "Väylien määrä";
    			t10 = space();
    			input2 = element("input");
    			t11 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			add_location(hr, file$1, 35, 2, 974);
    			attr_dev(label0, "for", "nimi");
    			attr_dev(label0, "class", "svelte-vlhq8p");
    			add_location(label0, file$1, 36, 2, 984);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "nimi");
    			attr_dev(input0, "class", "svelte-vlhq8p");
    			toggle_class(input0, "inputerror", !/*nimiValidi*/ ctx[5] && !/*ekaVierailu*/ ctx[6]);
    			add_location(input0, file$1, 37, 2, 1024);
    			attr_dev(label1, "for", "par");
    			attr_dev(label1, "class", "svelte-vlhq8p");
    			add_location(label1, file$1, 50, 2, 1379);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "id", "par");
    			attr_dev(input1, "class", "svelte-vlhq8p");
    			toggle_class(input1, "inputerror", !/*parValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[6]);
    			add_location(input1, file$1, 51, 2, 1417);
    			attr_dev(label2, "for", "vaylat");
    			attr_dev(label2, "class", "svelte-vlhq8p");
    			add_location(label2, file$1, 63, 2, 1705);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "id", "vaylat");
    			attr_dev(input2, "class", "svelte-vlhq8p");
    			toggle_class(input2, "inputerror", !/*vaylatValidi*/ ctx[3] && !/*ekaVierailu*/ ctx[6]);
    			add_location(input2, file$1, 64, 2, 1750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*uusiNimi*/ ctx[0]);
    			insert_dev(target, t3, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, label1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*par*/ ctx[1]);
    			insert_dev(target, t7, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, label2, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*vaylat*/ ctx[2]);
    			insert_dev(target, t11, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input0, "blur", /*blur_handler*/ ctx[11], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input1, "blur", /*blur_handler_1*/ ctx[13], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
    					listen_dev(input2, "blur", /*blur_handler_2*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*uusiNimi*/ 1 && input0.value !== /*uusiNimi*/ ctx[0]) {
    				set_input_value(input0, /*uusiNimi*/ ctx[0]);
    			}

    			if (dirty & /*nimiValidi, ekaVierailu*/ 96) {
    				toggle_class(input0, "inputerror", !/*nimiValidi*/ ctx[5] && !/*ekaVierailu*/ ctx[6]);
    			}

    			if (!/*nimiValidi*/ ctx[5] && !/*ekaVierailu*/ ctx[6]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(t4.parentNode, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*par*/ 2 && to_number(input1.value) !== /*par*/ ctx[1]) {
    				set_input_value(input1, /*par*/ ctx[1]);
    			}

    			if (dirty & /*parValidi, ekaVierailu*/ 80) {
    				toggle_class(input1, "inputerror", !/*parValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[6]);
    			}

    			if (!/*parValidi*/ ctx[4] && !/*ekaVierailu*/ ctx[6]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(t8.parentNode, t8);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*vaylat*/ 4 && to_number(input2.value) !== /*vaylat*/ ctx[2]) {
    				set_input_value(input2, /*vaylat*/ ctx[2]);
    			}

    			if (dirty & /*vaylatValidi, ekaVierailu*/ 72) {
    				toggle_class(input2, "inputerror", !/*vaylatValidi*/ ctx[3] && !/*ekaVierailu*/ ctx[6]);
    			}

    			if (!/*vaylatValidi*/ ctx[3] && !/*ekaVierailu*/ ctx[6]) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t3);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t7);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(label2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t11);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(31:0) <Modal>",
    		ctx
    	});

    	return block;
    }

    // (32:2) 
    function create_header_slot(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Syötä radan tiedot";
    			attr_dev(div0, "class", "sulje svelte-vlhq8p");
    			add_location(div0, file$1, 32, 4, 873);
    			add_location(h2, file$1, 33, 4, 933);
    			attr_dev(div1, "slot", "header");
    			add_location(div1, file$1, 31, 2, 848);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h2);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*naytaRadanLisays*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(32:2) ",
    		ctx
    	});

    	return block;
    }

    // (78:4) <Button on:click={lisaaRata} disabloitu={!lomakeValidi}>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lisää rata");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(78:4) <Button on:click={lisaaRata} disabloitu={!lomakeValidi}>",
    		ctx
    	});

    	return block;
    }

    // (79:4) <Button on:click={naytaRadanLisays}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Peruuta");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(79:4) <Button on:click={naytaRadanLisays}>",
    		ctx
    	});

    	return block;
    }

    // (77:2) 
    function create_footer_slot(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				disabloitu: !/*lomakeValidi*/ ctx[7],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*lisaaRata*/ ctx[8]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*naytaRadanLisays*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$1, 76, 2, 2043);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*lomakeValidi*/ 128) button0_changes.disabloitu = !/*lomakeValidi*/ ctx[7];

    			if (dirty & /*$$scope*/ 131072) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(77:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					footer: [create_footer_slot],
    					header: [create_header_slot],
    					default: [create_default_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, lomakeValidi, vaylatValidi, ekaVierailu, vaylat, parValidi, par, nimiValidi, uusiNimi*/ 131327) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let nimiValidi;
    	let parValidi;
    	let vaylatValidi;
    	let lomakeValidi;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UusiRata', slots, []);
    	const dispatch = createEventDispatcher();
    	let uusiNimi = '';
    	let par = 50;
    	let vaylat = 18;

    	// lisaaRata lähettää custom-tapahtuman, jonka parametreinä on lomakkeeseen syötetyt tiedot
    	const lisaaRata = () => dispatch('lisaaRata', { nimi: uusiNimi, par, vaylat });

    	const naytaRadanLisays = () => dispatch('naytaRadanLisays');

    	// lomakkeen validoinnit
    	let ekaVierailu = true;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UusiRata> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		uusiNimi = this.value;
    		$$invalidate(0, uusiNimi);
    	}

    	const blur_handler = () => $$invalidate(6, ekaVierailu = false);

    	function input1_input_handler() {
    		par = to_number(this.value);
    		$$invalidate(1, par);
    	}

    	const blur_handler_1 = () => $$invalidate(6, ekaVierailu = false);

    	function input2_input_handler() {
    		vaylat = to_number(this.value);
    		$$invalidate(2, vaylat);
    	}

    	const blur_handler_2 = () => $$invalidate(6, ekaVierailu = false);

    	$$self.$capture_state = () => ({
    		Modal,
    		Button,
    		createEventDispatcher,
    		dispatch,
    		uusiNimi,
    		par,
    		vaylat,
    		lisaaRata,
    		naytaRadanLisays,
    		ekaVierailu,
    		vaylatValidi,
    		parValidi,
    		nimiValidi,
    		lomakeValidi
    	});

    	$$self.$inject_state = $$props => {
    		if ('uusiNimi' in $$props) $$invalidate(0, uusiNimi = $$props.uusiNimi);
    		if ('par' in $$props) $$invalidate(1, par = $$props.par);
    		if ('vaylat' in $$props) $$invalidate(2, vaylat = $$props.vaylat);
    		if ('ekaVierailu' in $$props) $$invalidate(6, ekaVierailu = $$props.ekaVierailu);
    		if ('vaylatValidi' in $$props) $$invalidate(3, vaylatValidi = $$props.vaylatValidi);
    		if ('parValidi' in $$props) $$invalidate(4, parValidi = $$props.parValidi);
    		if ('nimiValidi' in $$props) $$invalidate(5, nimiValidi = $$props.nimiValidi);
    		if ('lomakeValidi' in $$props) $$invalidate(7, lomakeValidi = $$props.lomakeValidi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*uusiNimi*/ 1) {
    			$$invalidate(5, nimiValidi = uusiNimi.trim().length > 2);
    		}

    		if ($$self.$$.dirty & /*par, vaylat*/ 6) {
    			$$invalidate(4, parValidi = par > vaylat);
    		}

    		if ($$self.$$.dirty & /*vaylat*/ 4) {
    			$$invalidate(3, vaylatValidi = vaylat >= 0);
    		}

    		if ($$self.$$.dirty & /*nimiValidi, parValidi, vaylatValidi*/ 56) {
    			$$invalidate(7, lomakeValidi = nimiValidi && parValidi && vaylatValidi);
    		}
    	};

    	return [
    		uusiNimi,
    		par,
    		vaylat,
    		vaylatValidi,
    		parValidi,
    		nimiValidi,
    		ekaVierailu,
    		lomakeValidi,
    		lisaaRata,
    		naytaRadanLisays,
    		input0_input_handler,
    		blur_handler,
    		input1_input_handler,
    		blur_handler_1,
    		input2_input_handler,
    		blur_handler_2
    	];
    }

    class UusiRata extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UusiRata",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (88:2) {#if $kayttaja.ktun}
    function create_if_block_3(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*vaihdaNakyvyys*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(88:2) {#if $kayttaja.ktun}",
    		ctx
    	});

    	return block;
    }

    // (89:4) <Button on:click={vaihdaNakyvyys}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lisää uusi tulos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(89:4) <Button on:click={vaihdaNakyvyys}>",
    		ctx
    	});

    	return block;
    }

    // (94:2) {#if $kayttaja.ktun}
    function create_if_block_2(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*vaihdaNakyvyys*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(94:2) {#if $kayttaja.ktun}",
    		ctx
    	});

    	return block;
    }

    // (95:4) <Button on:click={vaihdaNakyvyys}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lisää uusi tulos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(95:4) <Button on:click={vaihdaNakyvyys}>",
    		ctx
    	});

    	return block;
    }

    // (98:2) {#if naytaLisays}
    function create_if_block_1(ctx) {
    	let uusitulos;
    	let current;
    	uusitulos = new UusiTulos({ $$inline: true });
    	uusitulos.$on("peruuta", /*vaihdaNakyvyys*/ ctx[4]);
    	uusitulos.$on("naytaRadanLisays", /*radanLisaysNakyvyys*/ ctx[5]);
    	uusitulos.$on("lisaaTulos", /*lisaaTulos*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(uusitulos.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uusitulos, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uusitulos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uusitulos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uusitulos, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(98:2) {#if naytaLisays}",
    		ctx
    	});

    	return block;
    }

    // (106:2) {#if naytaRadanLisays}
    function create_if_block(ctx) {
    	let uusirata;
    	let current;
    	uusirata = new UusiRata({ $$inline: true });
    	uusirata.$on("naytaRadanLisays", /*radanLisaysNakyvyys*/ ctx[5]);
    	uusirata.$on("lisaaRata", /*lisaaRata*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(uusirata.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uusirata, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uusirata.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uusirata.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uusirata, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(106:2) {#if naytaRadanLisays}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let login;
    	let t1;
    	let hr;
    	let t2;
    	let h2;
    	let t4;
    	let t5;
    	let tuloslista;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let footer;
    	let current;

    	header = new Header({
    			props: { nimi: /*sovellusInfo*/ ctx[0].nimi },
    			$$inline: true
    		});

    	login = new Login({ $$inline: true });
    	let if_block0 = /*$kayttaja*/ ctx[3].ktun && create_if_block_3(ctx);
    	tuloslista = new Tuloslista({ $$inline: true });
    	tuloslista.$on("poista", /*poistaTulos*/ ctx[7]);
    	let if_block1 = /*$kayttaja*/ ctx[3].ktun && create_if_block_2(ctx);
    	let if_block2 = /*naytaLisays*/ ctx[1] && create_if_block_1(ctx);
    	let if_block3 = /*naytaRadanLisays*/ ctx[2] && create_if_block(ctx);

    	footer = new Footer({
    			props: {
    				tekija: /*sovellusInfo*/ ctx[0].tekija,
    				vuosi: /*sovellusInfo*/ ctx[0].vuosi
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(login.$$.fragment);
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Pelatut kierrokset";
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			create_component(tuloslista.$$.fragment);
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			if (if_block2) if_block2.c();
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			create_component(footer.$$.fragment);
    			add_location(hr, file, 84, 2, 2335);
    			add_location(h2, file, 85, 2, 2344);
    			attr_dev(main, "class", "svelte-1r92fg5");
    			add_location(main, file, 82, 0, 2314);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(login, main, null);
    			append_dev(main, t1);
    			append_dev(main, hr);
    			append_dev(main, t2);
    			append_dev(main, h2);
    			append_dev(main, t4);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t5);
    			mount_component(tuloslista, main, null);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t8);
    			if (if_block3) if_block3.m(main, null);
    			insert_dev(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*sovellusInfo*/ 1) header_changes.nimi = /*sovellusInfo*/ ctx[0].nimi;
    			header.$set(header_changes);

    			if (/*$kayttaja*/ ctx[3].ktun) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$kayttaja*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$kayttaja*/ ctx[3].ktun) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$kayttaja*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t7);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*naytaLisays*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*naytaLisays*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, t8);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*naytaRadanLisays*/ ctx[2]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*naytaRadanLisays*/ 4) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(main, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			const footer_changes = {};
    			if (dirty & /*sovellusInfo*/ 1) footer_changes.tekija = /*sovellusInfo*/ ctx[0].tekija;
    			if (dirty & /*sovellusInfo*/ 1) footer_changes.vuosi = /*sovellusInfo*/ ctx[0].vuosi;
    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(login.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(tuloslista.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(login.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(tuloslista.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(login);
    			if (if_block0) if_block0.d();
    			destroy_component(tuloslista);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching) detach_dev(t9);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $radat;
    	let $tulokset;
    	let $kayttaja;
    	validate_store(radat, 'radat');
    	component_subscribe($$self, radat, $$value => $$invalidate(11, $radat = $$value));
    	validate_store(tulokset, 'tulokset');
    	component_subscribe($$self, tulokset, $$value => $$invalidate(12, $tulokset = $$value));
    	validate_store(kayttajaMetodit, 'kayttaja');
    	component_subscribe($$self, kayttajaMetodit, $$value => $$invalidate(3, $kayttaja = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { sovellusInfo } = $$props;
    	let naytaLisays = false;

    	// Uuden tuloksen lisäämisikkunan näyttämisen muuttaminen
    	function vaihdaNakyvyys() {
    		if (!naytaLisays) {
    			$$invalidate(1, naytaLisays = true);
    		} else {
    			$$invalidate(1, naytaLisays = false);
    		}
    	}

    	let naytaRadanLisays = false;

    	function radanLisaysNakyvyys() {
    		if (!naytaRadanLisays) {
    			$$invalidate(2, naytaRadanLisays = true);
    		} else {
    			$$invalidate(2, naytaRadanLisays = false);
    		}
    	}

    	// Uuden tuloksen lisääminen listaan. Funktio päivittää tulokset-storea
    	// lisäämällä listaan tuloksen, jonka tiedot tulevat ce.detailin arvoista
    	let tulosid = Math.max(0, ...$tulokset.map(t => t.id)) + 1;

    	function lisaaTulos(ce) {
    		tulokset.update(tulokset => [
    			...tulokset,
    			{
    				id: tulosid,
    				rata: ce.detail.rata,
    				tulos: ce.detail.uusiTulos,
    				pvm: ce.detail.pvm,
    				pelaaja: $kayttaja.ktun
    			}
    		]);

    		tulosid = Math.max(0, ...$tulokset.map(t => t.id)) + 1;
    		vaihdaNakyvyys();
    		alert('Tulos lisätty onnistuneesti!');
    	}

    	// tuloksen poistofunktio, joka filtteröi tuloksista customeventin
    	// parametrinä välitettyä id:tä vastaavan tuloksen
    	const poistaTulos = ce => {
    		set_store_value(tulokset, $tulokset = $tulokset.filter(tulos => tulos.id !== ce.detail), $tulokset);
    	};

    	// Uuden radan lisääminen toimii samalla periaatteella kuin uuden tuloksen lisääminen
    	let rataid = Math.max(0, ...$radat.map(t => t.id)) + 1;

    	function lisaaRata(ce) {
    		radat.update(radat => [
    			...radat,
    			{
    				id: rataid,
    				nimi: ce.detail.nimi,
    				par: ce.detail.par,
    				vaylat: ce.detail.vaylat
    			}
    		]);

    		rataid = Math.max(0, ...$radat.map(t => t.id)) + 1;
    		radanLisaysNakyvyys();
    		alert('Rata lisätty onnistuneesti!');
    	}

    	const writable_props = ['sovellusInfo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('sovellusInfo' in $$props) $$invalidate(0, sovellusInfo = $$props.sovellusInfo);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		Button,
    		Login,
    		tulokset,
    		radat,
    		kayttaja: kayttajaMetodit,
    		Tuloslista,
    		UusiTulos,
    		UusiRata,
    		sovellusInfo,
    		naytaLisays,
    		vaihdaNakyvyys,
    		naytaRadanLisays,
    		radanLisaysNakyvyys,
    		tulosid,
    		lisaaTulos,
    		poistaTulos,
    		rataid,
    		lisaaRata,
    		$radat,
    		$tulokset,
    		$kayttaja
    	});

    	$$self.$inject_state = $$props => {
    		if ('sovellusInfo' in $$props) $$invalidate(0, sovellusInfo = $$props.sovellusInfo);
    		if ('naytaLisays' in $$props) $$invalidate(1, naytaLisays = $$props.naytaLisays);
    		if ('naytaRadanLisays' in $$props) $$invalidate(2, naytaRadanLisays = $$props.naytaRadanLisays);
    		if ('tulosid' in $$props) tulosid = $$props.tulosid;
    		if ('rataid' in $$props) rataid = $$props.rataid;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sovellusInfo,
    		naytaLisays,
    		naytaRadanLisays,
    		$kayttaja,
    		vaihdaNakyvyys,
    		radanLisaysNakyvyys,
    		lisaaTulos,
    		poistaTulos,
    		lisaaRata
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { sovellusInfo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sovellusInfo*/ ctx[0] === undefined && !('sovellusInfo' in props)) {
    			console.warn("<App> was created without expected prop 'sovellusInfo'");
    		}
    	}

    	get sovellusInfo() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sovellusInfo(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        // sovelluksen tiedot, jotka voidaan hakea globaalisti
        sovellusInfo: {
          nimi: 'FribaScore',
          tekija: 'Tommi Tuikka',
          vuosi: '2022',
        },
      },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

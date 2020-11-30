const TEXT_ELEMENT = 'TEXT ELEMENT'

// jsx对象      {type, props, ...children}
// Xeact对象     {type, props}
// 虚拟dom元素  {dom, element, childInstances}
// 虚拟组件元素  {dom, element, childInstances, publicInstance }

// 将jsx转换的代码 转化成有效的js(Xeact元素)
function createElement(type,config,...args){
    const props = Object.assign({},config);// 拷贝对象
    const hasChildren = args.length > 0;// 获取child元素
    const rawChildren = hasChildren ? [].concat(...args): [];
    props.children = rawChildren.filter(c=> c!==null && c!== false).map(c=> c instanceof Object ? c : createTextElement(c));// 过略掉不规范数据
    return {type, props}
}
// 规范jsx输出文本节点数据
function createTextElement(value){
    return createElement(TEXT_ELEMENT, {nodeValue: value})
}
// 更新真实dom属性、事件
function updateDomProperties(dom, prevProps, nextProps){
    const isEvent = name => name.startsWith("on");// 判断属性是否为事件
    const isAttribute = name => !isEvent(name) && name != "children";// 判断属性是否为事件或者子节点
    Object.keys(prevProps).filter(isEvent).forEach(name => {// 移除事件
        const eventType = name.toLowerCase().substring(2);// 获取事件名称并转成小写，取两位后
        dom.removeEventListener(eventType, prevProps[name]);
      });
    Object.keys(prevProps).filter(isAttribute).forEach(name => {// 移除属性
        dom[name] = null;
    });
    Object.keys(nextProps).filter(isEvent).forEach(name=>{// 添加dom事件
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType,nextProps[name]);
    })
    Object.keys(nextProps).filter(isAttribute).forEach(name=>{// 添加属性
        dom[name] = nextProps[name];
    })
}

let rootInstance = null;// 记录上次实例
// 主程序入口
function render(element,container){
    rootInstance = reconcile(container, rootInstance, element);// 使用缓存虚拟dom对比Xeact元素，生成新的虚拟dom元素，并缓存。
}
// 生成虚拟dom，并添加最新真实dom到parentDom上
function reconcile(parentDom, instance, element){
    if(instance == null){// 缓存虚拟dom元素不存在
        const newInstance = instantiate(element);// 创建虚拟dom元素
        parentDom.appendChild(newInstance.dom);// 添加到真实dom元素上
        return newInstance;
    }else if(element == null){// Xeact元素不存在
        parentDom.remove(instance.dom);// 删除真实dom元素
        return null;
    }else if(instance.element.type !== element.type){// dom元素类型不相同
        const newInstance = instantiate(element);// 创建虚拟dom元素
        parentDom.replaceChild(newInstance.dom, instance.dom);// 真实dom替换
        return newInstance;
    }else if(typeof element.type === 'string'){// 缓存虚拟dom元素存在、Xeact元素存在、dom元素类型相同。复用真实dom元素，虚拟dom元素
        updateDomProperties(instance.dom, instance.element.props, element.props);// 使用Xeact元素props更新缓存虚拟dom的真实dom属性
        instance.childInstances = reconcileChildren(instance, element);// 生成子元素的虚拟dom
        instance.element = element;// 更新虚拟dom的Xeact元素引用
        return instance;
    }else{// 处理Xeact组件
        instance.publicInstance.props = element.props;// 更新公共实例props属性
        const childElement = instance.publicInstance.render(); // 调用公共组件实例的render方法，生成Xeact元素
        const childInstances = reconcile(parentDom, instance.childInstances, childElement);// 递归调用，处理所有的Xeact组件，返回虚拟dom
        instance.dom = childInstances.dom; // 赋值
        instance.childInstances = childInstances; // 赋值
        instance.element = element;// 赋值
        return instance;
    }
}
// 对比所有的子节点元素
function reconcileChildren(instance,element){
    const newChildInstances = [];// 返回的子节点元素数组
    const childInstances= instance.childInstances; // 缓存的子节点元素数组
    const nextChildElements = element.props.children || [];// 当前的子节点元素数组
    const count = Math.max(childInstances.length, nextChildElements.length);// 对比新旧数据的长度
    for(let i = 0; i< count; i++){// 简易demo只对比相同index的元素，暂时不考虑子元素key值等。
        const newChildInstance = reconcile(instance.dom, childInstances[i],nextChildElements[i]);// 生成新的子节点元素
        newChildInstances.push(newChildInstance);// 放入返回的数组中
    }
    return newChildInstances.filter(instance=>instance != null);// 过滤掉null的元素
}
// 接受Xeact，生成虚拟dom树元素。
function instantiate(element){
    const {type,props} = element;
    // 判断是否为组件
    const isDomElement = typeof type === 'string';
    if(isDomElement){// dom元素
        // 判断是否为文本节点
        const isTextElement = type === TEXT_ELEMENT;
        // 创建真实dom节点
        const dom = isTextElement ? document.createTextNode(""): document.createElement(type);
        // 为真实dom节点添加属性、事件
        updateDomProperties(dom, [], props);
        const childElements = props.children || [];
        // 递归子节点,生成子节点实例数组
        const childInstances = childElements.map(instantiate);
        // 添加子元素要真实dom
        childInstances.forEach(childInstance=>dom.appendChild(childInstance.dom));
        return {dom, element, childInstances}
    }else{// 组件元素 type值为class类
        const instance = {}; // 初始化Xeact元素对象
        const publicInstance = createPublicInstance(element,instance);// 创建一个公共组件实例
        const childElement = publicInstance.render();// 调用公共组件实例的render方法，生成Xeact元素
        const childInstances = instantiate(childElement); // 递归调用，虚拟组件全部转成虚拟dom
        const dom = childInstances.dom;// 赋值
        Object.assign(instance,{dom,element,childInstances,publicInstance});// 返回虚拟组件元素
        return instance;
    }
}
// 创建公共组件实例
function createPublicInstance(element,internalInstance){
    const {type,props} = element; // 取出Xeact元素的构造函数，和节点属性
    const publicInstance = new type(props);// 构造公共实例this对象
    publicInstance.__internalInstance = internalInstance; // 将组件实例对象添加到公共组件实例属性上, 形成相互引用
    return publicInstance; // 返回公共组件实例
}
// 更新虚拟dom
function updateInstance(internalInstance){
    const parentDom = internalInstance.dom.parentNode;// 赋值
    const element = internalInstance.element;// 赋值
    reconcile(parentDom, internalInstance, element); // 对比虚拟dom元素和Xeact元素，并添加最新真实dom到parentDom上
}
// 组件类
class Component{
    constructor(props){
        this.props = props;
        this.state = this.state || {};
    }
    setState(partialState){// 设置改变state的唯一方法
        this.state = Object.assign({},this.state,partialState)// 合并状态
        updateInstance(this.__internalInstance);// 更新 虚拟-Dom树和 更新 html
    }
}

export default {
    Component,
    render,
    createElement,
}
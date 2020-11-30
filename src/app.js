import React from "react";
import ReactDOM from "react-dom";

class Son extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            number:0
        }
        this.click = this.click.bind(this)
    }
    componentWillReceiveProps(){
        console.log('componentWillReceiveProps')
    }
    click(){
        this.setState({
            number: this.state.number+1
        })
    }
    componentDidUpdate(){
        console.log('componentDidUpdate')
    }
    render(){
        return <div>
                <span>子元素状态{this.state.number}</span>
                <button onClick={this.click}>子元素state改变</button>
                <span>父元素状态{this.props.count}</span>
            </div>
    }
}
class Father extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            count:0,
        }
        this.click = this.click.bind(this)
    }
    click(){
        this.setState({
            count: this.state.count+1
        })
    }
    render(){
        return <div>
            <button onClick={this.click}>父元素state改变</button>
            <Son count={this.state.count}></Son>
        </div>
    }
}
class App extends React.Component{
    render(){
        return <Father></Father>
    }
}

ReactDOM.render(<App>132</App>,document.getElementById('root'))

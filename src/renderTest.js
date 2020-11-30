import Xeact from "./fiber.js";
// import Xeact from "../render/index.js";

/** @jsx Xeact.createElement */
const rootDom = document.getElementById("root");
function tick() {
  const time = new Date().toLocaleTimeString();
  const clockElement = <h1>{time}</h1>;
  Xeact.render(clockElement, rootDom);
}

// tick();
// setInterval(tick, 1000);
// class App extends Xeact.Component{
//   constructor(props){
//     super(props);
//     this.state = {
//       time: 0
//     }
//   }
//   click(){
//     this.setState({
//       time:this.state.time+1
//     })
//   }
//   render(){
//     return <div>
//       <h1>{this.state.time}</h1>
//       <button onClick={()=>this.click()}>增加</button>
//     </div>
//   }
// }
function App(props){
  const [state,setState] = Xeact.useState(1);
  const fun = ()=>{
    setState(1)
  }
      return <div>
      <h1>count: {state}</h1>
      <button onClick={fun}>恢复</button>
      <button onClick={()=>setState(c=>c+2)}>增加2</button>
    </div>
}
Xeact.render(<App></App>,rootDom)
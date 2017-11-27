import React, {Component} from 'react'
import {size} from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageMap: [],
      dimensions: {width: 0, height: 0}
    };
  }

  render() {
    return <div>
      <form onSubmit={(e) => this.onSubmit(e)} encType={'multipart/form-data'}>
        <input type="file" name={'image'}/>
        <input type="submit" name={'submit'} value={'Send'}/>
      </form>
      {(size(this.state.imageMap) && <svg style={{height: this.state.dimensions.height, width: this.state.dimensions.width}}>
        {this.state.imageMap.map(({rgba,x,y}, index) => <circle fill={`rgba(${rgba})`} r="1" cx={x} cy={y} key={index} />)}
      </svg>) || <div>No data yet</div>}
    </div>;
  }

  onSubmit(event) {
    event.preventDefault();

    return fetch('/api/map', {
      method: 'post',
      body: new FormData(event.currentTarget)
    })
      .then(r => r.json())
      .then(({imageMap, dimensions}) => this.setState({imageMap, dimensions}))
      .catch(console.warn);
  }
}

export default App;

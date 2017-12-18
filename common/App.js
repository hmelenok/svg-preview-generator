import React, {Component} from 'react'
import {chunk, size, get} from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageMap: [],
      dimensions: {width: 0, height: 0},
      colors: []
    };
  }

  render() {
    return <div>
      <form onSubmit={(e) => this.onSubmit(e)} encType={'multipart/form-data'}>
        <input type="file" name={'image'}/>
        <input type="submit" name={'submit'} value={'Send'}/>
      </form>
      {(size(this.state.colors) &&
        <svg style={{height: this.state.dimensions.height, width: this.state.dimensions.width}}>

          {this.state.colors
            .map(({color, items}, topIndex) => {
              return (items
                .filter(([y, x, status = false]) => status === "alone")
                .map(([y, x], index) =>
                  <circle
                    key={index}
                    fill={`rgba(${color})`}
                    r="1"
                    cx={x}
                    cy={y}/>))
            })}
          {size(this.state.polylines) && this.state.polylines
            .map((topArray, index) => {
              const arr =  get(topArray, '0', '');
              const startPoint = get(arr, '0', '');
              const endPoint = get(arr, '1', '');
              const color = get(arr, '0.3', '');

              const startPointX = startPoint[1];
              const endPointX = endPoint[1];
              const startPointy = startPoint[0];
              const endPointy = endPoint[0];
              return (<polyline
                key={index}
                fill="none"
                stroke={`rgba(${color})`}
                points={`${startPointX},${startPointy} ${endPointX},${endPointy}`}>

              </polyline>)
            })}
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
      .then(({simplifyMapByColors: {colors}, dimensions}) => {
        this.setState({colors, dimensions});
        this.setState({
          polylines: colors
            .map(({color, items}, topIndex) => {
              return items.map(item => {
                item[3] = color;
                return item;
              }).filter(([y, x, status]) => status === 'start' || status === 'end')
            })
            .map(array => chunk(array, 2))
            .filter(size)
        });
        console.log(this.state);
      })
      .catch(console.warn);
  }
}

export default App;

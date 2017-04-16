import React, { PropTypes } from 'react'
import WantedRow from './WantedRow';
import ScrollableDiv from 'components/ScrollableDiv';

class WantedView extends React.Component {
  componentDidMount() {
    this.props.actions.fetchAllWanted();
    this.interval = setInterval(() => {
      this.props.actions.updateWanted()
    }, 3000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render () {
    const items = this.props.store.wanted;
    const itemsPerRows = 7;
    const rows = items.reduce((acc, item) => {
      const last = acc[acc.length - 1];
      if (last.length >= itemsPerRows) {
        return acc.concat([[item]]);
      }
      return [...acc.slice(0, acc.length - 1), [...last, item]];
    }, [[]]);
    const content = rows.map((rows, index) =>
      <WantedRow items={rows} key={index} current={
          this.props.store.wantedById[this.props.store.currentWanted]
        } onSelect={
          (id) => {
            // this.props.actions.invalidateWanted(id)
            this.props.actions.fetchWanted(id)
          }
        } onClose={
          () => this.props.actions.clearWanted()
        } onSearch={
          (id) => {
            this.props.actions.searchWanted(id)
          }
        } onPick={
          (id, wid) => {
            this.props.actions.selectResult(id, wid)
          }
        }/>);

    return <div>
      <ScrollableDiv>
        {content}
      </ScrollableDiv>
    </div>
  }
}

export default WantedView;

import React, { PropTypes } from 'react'
import Spinner from 'react-spinkit';
import classnames from 'classnames';

class ArtistsView extends React.Component {
  render () {
    if (this.props.artists) {
      const artists = this.props.artists.map((el) => (
        <div className={classnames('artistItem', {
            selected: el.id === this.props.childQuery,
            anySelected: this.props.childQuery
              && this.props.childQuery !== this.props.query
          })} key={el.id} onClick={() => {
            this.props.select(el.id);
          } }>
          <span>{el.name}</span>
          <div className="dis">{el.disambiguation}</div>
        </div>
      ));
      return <div>
        {artists}
      </div>;
    }
    return <div className="spinner">
      <Spinner spinnerName="three-bounce" noFadeIn />
    </div>;
  }
}

export default ArtistsView;

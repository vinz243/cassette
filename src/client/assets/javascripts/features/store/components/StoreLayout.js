import React, { PropTypes } from 'react'
import CatalogueView from './catalogue/CatalogueView';
import { Tab2, Tabs2 } from "@blueprintjs/core";
import './StoreApp.scss';

class StoreLayout extends React.Component {
  searchStringChange (e) {
    this.setState({
      searchString: e.target.value
    });
  }
  search (evt) {
    const { store, actions } = this.props;
    if (evt.key === 'Enter') {
      actions.fetchArtistsResult(this.state.searchString);
      actions.fetchAlbumsResult(this.state.searchString);
    }
  }
  render () {
    return (
      <div className="storeContainer">
        <div className="storeNav">
          <Tabs2 id="storeScope" onChange={this.handleTabChange}>
            <div className="chevrons">
              <span className="pt-icon pt-icon-chevron-left chevrons"></span>
              <span className="pt-icon pt-icon-chevron-right chevrons"></span>
            </div>
            <div className="pt-input-group search-box">
              <span className="pt-icon pt-icon-search"></span>
              <input className="pt-input"
                ref={(el) => this.input = el}
                type="search" placeholder="Search input"
                onChange={this.searchStringChange.bind(this)}
                onKeyPress={this.search.bind(this)} dir="auto" />
            </div>
            <Tab2 id="ca" title="Catalogue" panel={
                <CatalogueView {...this.props} />
            } />
            <Tab2 id="wi" title="Wanted Items" panel={null} />
        </Tabs2>
        </div>
      </div>
    );
  }
}

export default StoreLayout;

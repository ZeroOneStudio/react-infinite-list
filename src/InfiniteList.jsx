import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

const win = typeof window !== 'undefined' ? window : false;

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export default class InfiniteList extends Component {

  static defaultProps = {
    perPage: 40,
    size: 0,
    loadMore: () => {},
    threshold: 250
  }

  scrollListener() {
    const { loadMore, perPage, size, threshold } = this.props;
    const page = Math.floor(size / perPage) + 1;
    const el = findDOMNode(this);
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(threshold)) {
      this.detachScrollListener();

      loadMore(page);
    }
  }

  // TODO: Find a non destructive way to bind scroll events
  attachScrollListener() {
    win.onscroll = ::this.scrollListener;
    this.scrollListener();
  }

  detachScrollListener() {
    win.onscroll = null;
  }

  componentDidMount() {
    if (win) {
      this.attachScrollListener();
    }
  }

  componentDidUpdate() {
    if (win) {
      this.attachScrollListener();
    }
  }

  componentWillUnmount() {
    if (win) {
      this.detachScrollListener();
    }
  }

  render() {
    const { children } = this.props;

    return <div className="infinite-list">
      {children}
    </div>;
  }

}


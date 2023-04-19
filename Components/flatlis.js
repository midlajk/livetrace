import React from 'react';
import { FlatList } from 'react-native';

class CustomFlatList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      return true;
    }
    return false;
  }

  render() {
    const { data, renderItem, keyExtractor } = this.props;

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }
}

export default CustomFlatList;

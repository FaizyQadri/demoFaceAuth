import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import photoReducer from './redux/reducers';
import rootSaga from './redux/sagas';
import { fetchPhotosRequest } from './redux/actions';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(photoReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

const App = () => {
  const dispatch = useDispatch();
  const { data, loading, page } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchPhotosRequest());
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}>
        <Image
          source={{uri: item?.url}}
          style={{
            width: '100%',
            height: undefined,
            aspectRatio: 1,
            resizeMode: 'cover',
          }}
        />
        <Text style={{fontSize: 16, padding: 5, color: 'red'}}>
          {item?.title}
        </Text>
        <Text style={{fontSize: 16, padding: 5, color: 'green'}}>
          {item?.id}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      loading && (
        <View style={{ marginVertical: 10, alignItems: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      )
    );
  };

  const onEndReached = () => {
    dispatch(fetchPhotosRequest(page + 1));
  };

  return (
    <FlatList
      style={{
        marginTop: 20,
        backgroundColor: '#f5fcff',
      }}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;

import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';
import Navigation from './src/navigation/Index';
import { useGetMenuItemsQuery } from './src/domains/api/menu';
import { fetchMenuItemsSuccess } from './src/domains/slices/menuSlice';
import Toast from 'react-native-toast-message';



const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

export default function App() {
  // const dispatch = useDispatch();
  // const { data: menuItems, isLoading, isSuccess, isError, isFetching } = useGetMenuItemsQuery();

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(fetchMenuItemsSuccess(menuItems));
  //   }
  // }, [dispatch, isSuccess, menuItems]);


  return (

    <>
      <Navigation />
      <Toast />
    </>

  );
}

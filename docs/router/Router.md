# Router

`Router` 是基于 **React Navigation** 的路由组件，负责管理应用的页面导航与跳转逻辑。

## 依赖

项目已安装以下依赖：

```json
"@react-navigation/native": "^7.3.8",
"@react-navigation/native-stack": "^7.17.10",
"react-native-safe-area-context": "^5.8.0",
"react-native-screens": "^4.25.2"
```

## 基本用法

在 `src/` 下创建路由配置文件，集中管理所有页面：

```tsx
// src/router/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number; title?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '首页' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Router;
```

## 类型安全

通过 `RootStackParamList` 定义导航参数类型，所有页面和导航调用都能获得完整的 TypeScript 类型推导：

```tsx
// 在页面中获取路由参数
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../router';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ route, navigation }: Props) {
  const { itemId } = route.params; // 类型安全
  return (
    // ...
  );
}
```

## 集成到 App

在 `App.tsx` 中使用 `Router` 组件替换原有内容：

```tsx
// src/App.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from './router';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Router />
    </SafeAreaProvider>
  );
}

export default App;
```

## 页面间导航

在任意页面组件中通过 `navigation` prop 进行页面跳转：

```tsx
// 跳转到详情页
navigation.navigate('Details', { itemId: 42, title: '商品详情' });

// 返回上一页
navigation.goBack();

// 重置导航栈
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

## 进阶用法

### 底部 Tab 导航

如需底部 Tab，安装 `@react-navigation/bottom-tabs` 并使用：

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

### 抽屉导航

如需侧边抽屉，安装 `@react-navigation/drawer`。

## 参考

- [React Navigation 官方文档](https://reactnavigation.org/docs/getting-started/)

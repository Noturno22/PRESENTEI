import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    inicio: '❤️',
    calendario: '📅',
    contactos: '📇',
    presentes: '🎁',
    pedidos: '🛍️',
    perfil: '👤',
  };

  return (
    <View className="items-center justify-center">
      <Text className={`text-xl ${focused ? 'opacity-100' : 'opacity-50'}`}>
        {icons[name] ?? '●'}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2D1140',
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#FF4D8D',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon name="inicio" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ focused }) => <TabIcon name="calendario" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="contactos"
        options={{
          title: 'Contactos',
          tabBarIcon: ({ focused }) => <TabIcon name="contactos" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="presentes"
        options={{
          title: 'Presentes',
          tabBarIcon: ({ focused }) => <TabIcon name="presentes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ focused }) => <TabIcon name="pedidos" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon name="perfil" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

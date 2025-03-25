import {Tabs} from 'expo-router'

export default function TabsLayouts(){
  return (
    <Tabs>
      <Tabs.Screen name='Pacientes' options={{ title: 'Pacientes'}}/>
      <Tabs.Screen name='Citas' options={{ title: 'Citas'}}/>
    </Tabs>
  )
}
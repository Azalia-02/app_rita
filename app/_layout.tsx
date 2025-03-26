import { Stack } from "expo-router";

export default function RootLayout (){
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false}}/>
      <Stack.Screen name="login_alta" options={{ headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false}}/>
      <Stack.Screen name="medico_alta" options={{ title: 'Nuevo Médico' }} />
      <Stack.Screen name="medico_editar" options={{ title: 'Actualizar Médico' }} />
      <Stack.Screen name="medico_detalle" options={{ title: 'Detalle Médico' }} />
      <Stack.Screen name="paciente_alta" options={{ title: 'Nuevo Paciente' }} />
      <Stack.Screen name="paciente_editar" options={{ title: 'Actualizar Paciente' }} />
      <Stack.Screen name="paciente_detalle" options={{ title: 'Detalle Paciente' }} />
      <Stack.Screen name="cita_alta" options={{ title: 'Nueva Cita' }} />
      <Stack.Screen name="Usuarios" options={{ title: 'Usuarios' }} />
    </Stack>
  )
}
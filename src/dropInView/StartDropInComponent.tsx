import { View, Button } from 'react-native'
import React from 'react'
import { useAdyenCheckout } from '@adyen/react-native';

export default function StartDropInComponent() {
    const {start} = useAdyenCheckout();
    function startDropIn(): void {
        start('dropIn');
    }

  return (
    <View>
      <Button title="Start Drop-In" onPress={startDropIn} />
    </View>
  )
}
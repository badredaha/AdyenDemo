// DropInView.tsx
import React, {useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {
  AdyenCheckout,
  AdyenActionComponent,
  PaymentMethodData,
  PaymentDetailsData,
  Configuration,
} from '@adyen/react-native';
import StartDropInComponent from './StartDropInComponent';
import { gql, useMutation } from '@apollo/client';

// GraphQL Mutation
const MUTATION_GRAPH = gql`
  mutation bookingProcess($bookingProcessRequest: MbBookingProcessInputType!, $locale: String!, $brandCode: String!, $currencyCode: String!, $password: String, $useSynXis: Boolean) {
    bookingProcess(
      bookingProcessInput: {
        bookingProcessRequest: $bookingProcessRequest,
        locale: $locale,
        brandCode: $brandCode,
        currencyCode: $currencyCode,
        password: $password,
        useSynXis: $useSynXis
      }
    ) {
      status
      confirmationNumber
      legNumber
      transactionId
      success
      adyenAction
    }
  }
`;


const DropInView = () => {
  // Replace these with your actual payment methods and configuration
  const paymentMethodsResponse = {
    paymentMethods: [
      {
        name: 'Credit Card',
        type: 'scheme',
        brands: ['visa', 'mc', 'amex'],
      },
    ],
  };

  const configuration: Configuration = {
    environment: 'test', // or 'live'
    clientKey: 'test_I3UZ6TZ3SZGOTCKANWCNOZ3SRULQK6MY', // Obtain from Adyen Customer Area
    countryCode: 'US',
    returnUrl: 'refontlhapp://',
    amount: {
      value: 1000, // e.g., 1000 means 10.00 USD
      currency: 'USD',
    },
  };

  const [bookingProcess, {loading, error}] = useMutation(MUTATION_GRAPH);


        const handleRequest = useCallback(
          async (data: PaymentMethodData, dropIn: any) => {
            try {
              const variables = {
                bookingProcessRequest: {
                  adyenData: {
                    storePaymentMethod: false,
                    paymentMethod: {
                      threeDS2SdkVersion: '2.4.2',
                      encryptedExpiryYear: 'your-encrypted-value',
                      type: 'scheme',
                      encryptedSecurityCode: 'your-encrypted-value',
                      encryptedCardNumber: 'your-encrypted-value',
                      holderName: 'Bare',
                      encryptedExpiryMonth: 'your-encrypted-value',
                    },
                    amount: {
                      value: 4879,
                      currency: 'EUR',
                    },
                    returnUrl: 'refontlhapp://',
                    channel: 'iOS',
                  },
                  adyenAdditionalDetails: null,
                  adyenServices: null,
                  specialCode: {
                    cardHolderLastName: '',
                    specialCodeType: null,
                    specialCodeValue: '',
                  },
                  customerInfo: {
                    applicationOrigin: 'APP',
                    isRegisteredToFidNewsletter: false,
                    isRegisteredToNewsletter: false,
                    userInfo: {
                      email: 'email@email.com',
                      firstName: 'firstName',
                      lastName: 'lastName',
                    },
                  },
                  pspRef: 'ADYEN',
                  adyenFormType: 'DROP_IN',
                  resortId: 'FRA22177',
                  startDate: '2025-02-26T12:07:53.658+00:00',
                  endDate: '2025-02-27T12:07:53.735+00:00',
                  rooms: [
                    {
                      adultCount: 1,
                      childCount: 0,
                      rateCode: 'PRBA',
                      roomTypeCode: 'DBL',
                      packages: [],
                    },
                  ],
                  clientSource: {
                    deviceOsType: 'iOS',
                    deviceType: 'M',
                    pointOfSales: 'LG',
                  },
                },
                locale: 'en-US',
                brandCode: 'PC',
                currencyCode: 'EUR',
              };

              const response = await bookingProcess({variables});

              if (response?.data?.bookingProcess?.success) {
                dropIn.hide(true);
                Alert.alert('Success', 'Payment completed successfully!');
              } else {
                dropIn.hide(false);
                Alert.alert('Payment Failed', 'Transaction unsuccessful.');
              }
            } catch (err) {
              console.error('GraphQL Mutation Error:', err);
              dropIn.hide(false);
              Alert.alert(
                'Error',
                'Something went wrong during the booking process.',
              );
            }
          },
          [bookingProcess],
        );

  // Handle submitting the payment method
  const onSubmit = useCallback(
    (data: PaymentMethodData, dropIn: AdyenActionComponent) => {
      // Call your server API to process payment
      console.log('Payment method data:', data);
       handleRequest(data, dropIn);
    },
    [handleRequest],
  );

  // Handle additional details like 3DS challenges
  const onAdditionalDetails = useCallback(
    (details: PaymentDetailsData, dropIn: AdyenActionComponent) => {
      console.log('Additional details:', details);
      dropIn.hide(true); // Hide after handling details
    },
    [],
  );

  // Handle payment completion
  const onComplete = useCallback(() => {
    console.log('Payment flow completed.');
  }, []);

  // Handle payment errors
  const onError = useCallback((error: any) => {
    console.error('Payment error:', error);
    Alert.alert('Error', error.message);
  }, []);

  return (
    <View style={styles.container}>
      <AdyenCheckout
        paymentMethods={paymentMethodsResponse}
        config={configuration}
        onSubmit={onSubmit}
        onAdditionalDetails={onAdditionalDetails}
        onComplete={onComplete}
        onError={onError}>
        <StartDropInComponent />
      </AdyenCheckout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default DropInView;

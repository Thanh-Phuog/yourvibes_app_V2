import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Modal } from '@ant-design/react-native';
import { useAuth } from '@/src/context/auth/useAuth';

const MyDateTimePicker = ({
  value,
  onCancel,
  show,
  onSubmit,
  maxDate,
  minDate,
}: {
  value: Date;
  onCancel: () => void;
  onSubmit: (date: Date) => void;
  show: boolean;
  maxDate?: Date;
  minDate?: Date;
}) => {
  const [date, setDate] = useState(value);
  const { localStrings } = useAuth();
  const handleChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set') {
      const chosenDate = selectedDate || date;
      setDate(chosenDate);
      onSubmit(chosenDate);
      if (Platform.OS !== 'ios') {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <Modal
          visible={show}
          transparent={true}
          animationType="slide"
          style={{
            width: "100%"
          }}
        >
          <View
            style={{
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white'
              }}
            >
              <DateTimePicker
                value={date}
                mode="date"
                maximumDate={maxDate}
                display={'spinner'}
                onChange={handleChange}
                minimumDate={minDate}
                style={{ width: "50%" }}
              />
              {/* Close Button */}
              <Button
                type='primary'
                onPress={onCancel}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: 'white' }}>{localStrings.Public.Close}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      ) : (
        <>
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              maximumDate={maxDate}
              minimumDate={minDate}
              display={'spinner'}
              onChange={handleChange}
            />
          )}
        </>
      )}
    </>

  );
};

export default MyDateTimePicker;

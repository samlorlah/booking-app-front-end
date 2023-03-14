import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spinner, Option } from 'react-bootstrap';
import { Button } from 'bootstrap';
import Select from 'react-bootstrap-select';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { allMessages, allStatus, bookVehicle } from '../redux/reducer/bookings/bookingSlice';
import { authenticatedUser } from '../redux/reducer/user/userSlice';
import userToken from '../redux/reducer/user/userToken';
import { vehicle, vehicles } from '../redux/reducer/vehicles/vehicleSlice';
import Alert from './Alert';
import 'antd/dist/antd.css';

const Bookings = () => {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const currentUser = useSelector(authenticatedUser);
  const allVehicles = useSelector(vehicles);
  const message = useSelector(allMessages);
  const status = useSelector(allStatus);
  const selectedVehicle = useSelector(vehicle).id;
  const [vehicleId, setVehicleId] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTokenSet = userToken();

  const handleDateFormat = (date) => dayjs(date).format('YYYY/MM/DD');

  const handleVehicleId = (vehicleId) => setVehicleId(+vehicleId);

  const handleBooking = () => {
    const booking = {
      pickup_date: pickupDate,
      return_date: returnDate,
      vehicle_id: vehicleId,
    };

    const bookingObject = {
      booking,
      userId: currentUser.id,
    };

    dispatch(bookVehicle(bookingObject));
  };

  const navigateBooking = () => {
    if (message === 'Vehicle successfuly booked') navigate('/bookings');
  };

  const checkAuthorizedUser = () => {
    if (!isTokenSet) navigate('/login');
  };

  const handleSelectedVehicle = () => {
    if (selectedVehicle) setVehicleId(selectedVehicle);
  };

  useEffect(() => {
    handleSelectedVehicle();
    navigateBooking();
    checkAuthorizedUser();
  }, [message, isTokenSet, selectedVehicle]);

  document.title = 'Luxury Vehicles | Booking';
  return (
    <>
      { status === 'failed' && <Alert message={message} />}
      ;
      <div className="mt-4 mx-auto w-100 bg-light border-0 rounded-3 p-3" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <div className="mb-3 d-flex justify-content-center align-items-center text-light bg-dark opacity-50 bg-gradient" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <h3 className="text-uppercase text-light" style={{ letterSpacing: '0.1em; font-weight: 300' }}>
            Book a Vehicle
          </h3>
        </div>
        <div className="text-center">
          <h5 className="mb-2">Kind Note</h5>
          <p className="text-left">
            From Lamborghini to Mercedes, we have it all. Luxury Cars provides you with
            the best luxury car rental services worldwide.
          </p>
        </div>
        <div className="d-flex flex-column gap-4 text-danger">
          <DatePicker
            placeholder="Pickup Date"
            placement="topLeft"
            size="large"
            format="YYYY/MM/DD"
            allowClear
            minDate={new Date()}
            onChange={(date) => setPickupDate(handleDateFormat(date))}
          />
          <DatePicker
            placeholder="Return Date"
            placement="topLeft"
            size="large"
            format="YYYY/MM/DD"
            allowClear
            minDate={new Date()}
            onChange={(date) => setReturnDate(handleDateFormat(date))}
          />
          <Select
            className=""
            style={{ color: 'rgb(255, 193, 7)' }}
            name="Vehicle"
            value={selectedVehicle?.toString()}
            label="Select a Vehicle"
            onChange={handleVehicleId}
            required
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
          >
            {allVehicles.map(({ id: vehicleId, name }) => (
              <Option value={vehicleId.toString()} key={vehicleId}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <Button
            type="button"
            onClick={handleBooking}
            variant="gradient"
            className="text-uppercase font-weight-bold py-3 btn btn-primary w-100"
            style={{ color: 'rgb(255, 193, 7)' }}
          >
            {status === 'loading' ? <Spinner /> : <span>Add Vehicle</span>}
          </Button>
        </div>
        ;
      </div>
      ;
    </>
  );
};

export default Bookings;

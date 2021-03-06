import React, { Component } from "react";
import './BookRoom.scss';
import DatePicker from "react-datepicker";
import * as Service from "./RoomServices";
import { Input, Textarea } from '../../config/HomeCatalog/ComponentSetting';
import { connect } from "react-redux";
import { success, error } from "../../../actions";
import DropdownPayMethod from '../../../components/commons/dropdown/DropdownPayMethod';
import BookingSoure from '../../../components/commons/dropdown/BookingSoure';
import Country from '../../../components/Maps/Country';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const STRINGS = {
    CHECK_IN: <FormattedMessage id="CHECK_IN" />,
    CHECK_OUT: <FormattedMessage id="CHECK_OUT" />,
    BOOK_ROOM: <FormattedMessage id="BOOK_ROOM" />,
    EXTRA_INFO: <FormattedMessage id="EXTRA_INFO" />,
    DESCRIPTION: <FormattedMessage id="DESCRIPTION" />,
    NOTES: <FormattedMessage id="NOTES" />,
    EMAIL: <FormattedMessage id="EMAIL" />,
    CUSTOMER_NAME: <FormattedMessage id="CUSTOMER_NAME" />,
    NO_ID_PASSPORT: <FormattedMessage id="NO_ID_PASSPORT" />,
    PHONE: <FormattedMessage id="PHONE" />,
    BIRTH_DAY: <FormattedMessage id="BIRTH_DAY" />,
    TOTAL_COST: <FormattedMessage id="TOTAL_COST" />,
    DISCOUNT: <FormattedMessage id="DISCOUNT" />,
    PAYMENT_METHOD: <FormattedMessage id="PAYMENT_METHOD" />,
    ROOM_INFO: <FormattedMessage id="ROOM_INFO" />,
    GUESTS: <FormattedMessage id="ROOM_INFO" />,
    SOURCE: <FormattedMessage id="SOURCE" />,
    SELECT_COUNTRY: <FormattedMessage id="SELECT_COUNTRY" />,
}


const defaultState = props => ({
    roomId: "",
    customerId: "",
    bookingSource: "",
    booking_code: "",
    checkin: moment((new Date()).toISOString()),
    checkout: moment((new Date()).toISOString()),
    guestNumber: 0,
    totalMoney: 0,
    prePay: 0,
    remainMoney: 0,
    description: "",
    customerPassportId: '',
    payMethod: "",
    periodPayment: 0,
    create_at: (new Date()).toISOString(),
    update_at: (new Date()).toISOString(),
    create_by: "",
    id: ""
})

class BookRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: defaultState(this.props),
            roomName: '',
            disable: false
        }
    }

    componentWillMount = () => {
        const { roomId } = this.props.match.params;
        this.onChangeData({ target: { name: 'roomId', value: roomId } });
        Service.getRoomById(roomId, res => {

            if (res.data.data.currentReservation) {
                Service.getRevervationById(res.data.data.currentReservation, res => {
                    this.setState({
                        selected: res.data.data,
                        disable: true
                    });
                })
            }
        })
    }

    onChangeDataDateTime = (key, data) => {
        this.setState({ selected: { ...this.state.selected, [key]: data } });
    }
    onChangeData = (e) => {
        const { target } = e;
        const { name } = target;
        this.setState({ selected: { ...this.state.selected, [name]: target.value } })
    }

    handleSubmit = () => {
        let data = { ...this.state.selected };
        const { userId, success, error } = this.props;
        const { disable } = this.state;
        data.userId = userId;
        if (disable) {
            data.update_at = (new Date()).toISOString();
            Service.UpDateReversation(data, res => {
                success("Update Success");
                // this.props.history.push("/Room");
            }, er => { error(er) })
        } else {
            Service.BookRoom(data, res => {
                success("Creacte Success");
                // this.props.history.push("/Room");
            }, er => { error(er) });
        }
    }

    onChangeCountry = (e) => {
        this.onChangeData({ target: { name: 'customerCountry', value: e.value } });
    }

    render() {
        const totalMoney = STRINGS.SOURCE + "(Vnd)";
        const prePay = STRINGS.PREPAY + "(%)";
        const { selected, disable } = this.state;
        if (disable) {
            selected.checkin = moment(selected.checkin);
            selected.checkout = moment(selected.checkout);
        }
        return (
            <div className="book_room">
                <div className="header"><h1>{selected.roomName}</h1></div>
                <div className="contact-info">
                    <div className="header"><span>{STRINGS.ROOM_INFO}</span></div>

                    <div className="row" style={{ marginBottom: '16px' }}>
                        <div className="col-lg-4">{STRINGS.CHECK_IN}</div>
                        <div className="col-lg-8">
                            <DatePicker className="form-control" isClearable={true} selected={selected.checkin}
                                style={{ width: '213px' }}
                                onChange={(e) => this.onChangeDataDateTime('checkin', e)} disabled={disable} />
                        </div>
                    </div>

                    <div className="row" style={{ marginBottom: '16px' }}>
                        <div className="col-lg-4"><span>{STRINGS.CHECK_OUT}</span></div>
                        <div className="col-lg-8">
                            <DatePicker className="form-control" isClearable={true} selected={selected.checkout}
                                style={{ width: '213px' }}
                                onChange={(e) => this.onChangeDataDateTime('checkout', e)} />
                        </div>
                    </div>

                    <Input value={selected.guestNumber} title={STRINGS.GUESTS} name='guestNumber'
                        disabled={disable} onChangeData={this.onChangeData} />


                    <div className="row">
                        <div className="col-lg-4">{STRINGS.SOURCE}</div>
                        <div className="col-lg-8">
                            <BookingSoure onChangeData={this.onChangeData} disabled={disable}
                                defaultValue={selected.bookingSource} name="bookingSource" />
                        </div>
                    </div>

                    <Input value={selected.totalMoney} title={totalMoney} name='totalMoney'
                        onChangeData={this.onChangeData} />

                    <Input value={selected.prePay} title={prePay} name='prePay'
                        onChangeData={this.onChangeData} />

                    <Input value={selected.prepay_rate} title="Prepay rate" name='prepay_rate'
                        disabled={disable} onChangeData={this.onChangeData} />

                    <div className="row">
                        <div className="col-lg-4">{STRINGS.PAYMENT_METHOD}</div>
                        <div className="col-lg-8">
                            <DropdownPayMethod name='payMethod' defaultValue={selected.payMethod}
                                disabled={disable} onChangeData={this.onChangeData} />
                        </div>
                    </div>

                </div>
                <div className="right-info">
                    <div className="customer-info">
                        <div className="header">{STRINGS.ROOM_INFO}</div>
                        <Input value={selected.customerEmail} title="Email" name='customerEmail'
                            disabled={disable} onChangeData={this.onChangeData} />


                        <Input value={selected.customerPhone} title={STRINGS.PHONE} name='customerPhone'
                            disabled={disable} onChangeData={this.onChangeData} />

                        <Input value={selected.customerPassportId} title={STRINGS.NO_ID_PASSPORT} name='customerPassportId'
                            disabled={disable} onChangeData={this.onChangeData} />

                        <div className="row">
                            <div className="col-lg-4">{STRINGS.BIRTH_DAY}</div>
                            <div className="col-lg-8">
                                <DatePicker className="form-control" isClearable={true} selected={selected.birthDay}
                                    style={{ width: '213px' }} disabled={disable}
                                    onChange={(e) => this.onChangeDataDateTime('birthDay', e)} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-4"><span>{STRINGS.SELECT_COUNTRY}</span></div>
                            <div className="col-lg-8">
                                <Country onChangeCountry={this.onChangeCountry} defaultValue={selected.country} />
                            </div>
                        </div>

                    </div>
                    <div className="extra-info">
                        <div className="header">{STRINGS.EXTRA_INFO}</div>
                        <Textarea value={selected.description} title={STRINGS.DESCRIPTION} name='description'
                            onChangeData={this.onChangeData} />

                        <Input value={selected.extraInfo} title={STRINGS.NOTES} name='extraInfo'
                            onChangeData={this.onChangeData} />
                    </div>
                </div>
                <button className='btn' onClick={this.handleSubmit}>{STRINGS.BOOK_ROOM}</button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: state.authentication.user.id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        success: (message) => {
            dispatch(success(message));
        },
        error: (message) => {
            dispatch(error(message));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookRoom);
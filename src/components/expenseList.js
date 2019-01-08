import React from 'react'
import { connect } from 'react-redux';
import ExpensesOnSingleDate from './expensesOnSingleDate';
import getVisibleAndSortedExpenses from '../selectors/index'
import { setTextFilter } from '../actions/filters';
import TextFilterSet from './textFilterSet';

class ExpenseList extends React.Component {
    state = {
        expensesOnUniqueDates: [],
        numberOfTotalExpenses: 0,
        totalExpensesThisMonth: 0
    }
    onTextFilterChange = (e) => {
        this.props.dispatch(setTextFilter(e.target.value))
    }
    componentDidUpdate() {
        if (this.state.numberOfTotalExpenses != this.props.expenses.length) {
            console.log("updated")
            let uniqueDates = [];
            var expensesOnUniqueDates = [];
            for (let i = 0; i < this.props.expenses.length; i++) {
                var flag = 0;
                for (let j = 0; j < uniqueDates.length; j++) {
                    if (this.props.expenses[i].createdDate === uniqueDates[j]) {
                        flag = flag + 1;
                    }
                }
                if (flag == 0) {
                    const currentDate = this.props.expenses[i].createdDate
                    const expensesOnThisDate = this.props.expenses.filter((expense) => {
                        if (expense.createdDate == currentDate) {
                            return true;
                        } else {
                            return false;
                        }
                    })

                    expensesOnUniqueDates = [
                        ...expensesOnUniqueDates,
                        expensesOnThisDate
                    ]

                    uniqueDates = uniqueDates.concat(currentDate)
                    console.log(expensesOnUniqueDates)

                    console.log(uniqueDates)
                }
            }
            let totalExpensesThisMonth = 0;
            for (let i = 0; i < this.props.expenses.length; i++) {
                totalExpensesThisMonth = totalExpensesThisMonth + this.props.expenses[i].amount
            }
            const numberOfTotalExpenses = this.props.expenses.length;
            this.setState({ expensesOnUniqueDates, numberOfTotalExpenses, totalExpensesThisMonth })
        }
    }
    componentWillMount() {
        let uniqueDates = [];
        var expensesOnUniqueDates = [];

        for (let i = 0; i < this.props.expenses.length; i++) {
            var flag = 0;
            for (let j = 0; j < uniqueDates.length; j++) {
                if (this.props.expenses[i].createdDate === uniqueDates[j]) {
                    flag = flag + 1;
                }
            }
            if (flag == 0) {
                const currentDate = this.props.expenses[i].createdDate
                const expensesOnThisDate = this.props.expenses.filter((expense) => {
                    if (expense.createdDate == currentDate) {
                        return true;
                    } else {
                        return false;
                    }
                })

                expensesOnUniqueDates = [
                    ...expensesOnUniqueDates,
                    expensesOnThisDate
                ]

                uniqueDates = uniqueDates.concat(currentDate)
                console.log(expensesOnUniqueDates)

                console.log(uniqueDates)
            }
        }

        //calculate total expenses this month
        let totalExpensesThisMonth = 0;
        for (let i = 0; i < this.props.expenses.length; i++) {
            totalExpensesThisMonth = totalExpensesThisMonth + this.props.expenses[i].amount
        }
        const numberOfTotalExpenses = this.props.expenses.length;
        this.setState({ expensesOnUniqueDates, numberOfTotalExpenses, totalExpensesThisMonth })
    }
    render() {
        return (
            <div>
                <input type="text" name="textFilter" placeholder="Search expenses" value={this.props.filters.textFilter} onChange={this.onTextFilterChange} />
                <button onClick={() => {
                    this.props.dispatch(setTextFilter(""))
                }}>Clear Filter</button>
                <h2>Your monthly target: {this.props.expenseTarget.monthlyTarget}</h2>
                <p>This month's expenditure: {this.state.totalExpensesThisMonth}</p>
                <h3>Here are the expenses</h3>
                {this.props.filters.textFilter != "" ? <TextFilterSet /> : this.state.expensesOnUniqueDates.map(date => <ExpensesOnSingleDate key={date[0].id} expenses={date} />)}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    expenses: getVisibleAndSortedExpenses(state.expenses, state.filters),
    // expenses: state.expenses,
    filters: state.filters,
    expenseTarget: state.expenseTarget
})

export default connect(mapStateToProps)(ExpenseList)
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HiCheck, HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi2';
import { HiDownload } from 'react-icons/hi';
import { 
  useGetDriverSalaryQuery,
  useGetDriverPaymentsQuery, 
  useGetRouteIncomeQuery,
  useGetParentPaymentStatusQuery
} from '../../redux/features/paymentSlice';
import Spinner from './Spinner';

export default function Payments() {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedMonth, setSelectedMonth] = useState('August 2023');

  // RTK Query hooks
  const { data: salaryData, isLoading: salaryLoading } = useGetDriverSalaryQuery(selectedMonth);
  const { data: paymentsHistory, isLoading: paymentsLoading } = useGetDriverPaymentsQuery();
  const { data: routeIncomeData, isLoading: routeIncomeLoading } = useGetRouteIncomeQuery(selectedMonth);
  const { data: parentPaymentsData, isLoading: parentPaymentsLoading } = useGetParentPaymentStatusQuery();
  
  // Function to render appropriate status badge
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
            <HiCheck className="mr-1" /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
            <HiOutlineClock className="mr-1" /> Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
            <HiOutlineExclamationCircle className="mr-1" /> Overdue
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        
        <div className="flex items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
          >
            <option value="August 2023">August 2023</option>
            <option value="July 2023">July 2023</option>
            <option value="June 2023">June 2023</option>
            <option value="May 2023">May 2023</option>
            <option value="April 2023">April 2023</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'summary'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Salary Summary
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('routeIncome')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'routeIncome'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Route Income
          </button>
          <button
            onClick={() => setActiveTab('parentPayments')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
              activeTab === 'parentPayments'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Parent Payments
          </button>
        </div>

        <div className="p-5">
          {/* Salary Summary Tab */}
          {activeTab === 'summary' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {salaryLoading ? (
                <Spinner />
              ) : salaryData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">Next Payment</h3>
                        <span className="text-amber-600 font-medium">{salaryData.nextPaymentDate}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-800">${salaryData.grossAmount}</span>
                          <span className="text-gray-500 ml-2">gross monthly salary</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">${salaryData.netAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Payment Method: {salaryData.paymentMethod}</span>
                        <span className="text-gray-600">Account: {salaryData.accountEnding}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Deductions</h3>
                      <div className="space-y-3">
                        {Object.entries(salaryData.deductions).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            <span className="font-medium text-gray-800">${value}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center font-semibold">
                          <span>Total Deductions</span>
                          <span>${salaryData.totalDeductions}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
                      <h3 className="font-semibold text-gray-800 mb-4">Recent Bonuses</h3>
                      {salaryData.bonuses.length > 0 ? (
                        <div className="space-y-4">
                          {salaryData.bonuses.map((bonus, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-100 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-gray-800">{bonus.description}</span>
                                <span className="font-bold text-green-600">${bonus.amount}</span>
                              </div>
                              <div className="text-xs text-gray-500">Paid on {bonus.date}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No recent bonuses to display.</p>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
                        <div className="space-y-3">
                          <button className="w-full py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm flex items-center justify-center transition-colors">
                            <HiDownload className="mr-2" /> Download Tax Statement
                          </button>
                          <button className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center justify-center transition-colors">
                            Update Payment Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  Error loading salary data
                </div>
              )}
            </motion.div>
          )}

          {/* Payment History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {paymentsLoading ? (
                <Spinner />
              ) : paymentsHistory ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Payment Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Pay Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Gross Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Net Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentsHistory.payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{payment.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{payment.payDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${payment.grossAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${payment.netAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="px-3 py-1 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors font-medium flex items-center text-xs">
                              <HiDownload className="mr-1" /> Payslip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  Error loading payment history
                </div>
              )}
            </motion.div>
          )}

          {/* Route Income Tab */}
          {activeTab === 'routeIncome' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {routeIncomeLoading ? (
                <Spinner />
              ) : routeIncomeData ? (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Route Income Summary</h3>
                    <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg">
                      <span className="font-medium">${routeIncomeData.totalIncome}</span> monthly total
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Total Students</div>
                      <div className="text-2xl font-semibold text-gray-800">{routeIncomeData.totalStudents}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Rate Per Student</div>
                      <div className="text-2xl font-semibold text-gray-800">${routeIncomeData.ratePerStudent}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-700 mb-1">Total Monthly Income</div>
                      <div className="text-2xl font-semibold text-green-600">${routeIncomeData.totalIncome}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <h4 className="font-medium text-gray-800 p-4 border-b border-gray-200">Route Details</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Route Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Students</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Rate Per Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {routeIncomeData.routes.map((route, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{route.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{route.students}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${route.ratePerStudent}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${route.total}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-medium">
                            <td colSpan={2} className="px-6 py-4 text-sm text-right text-gray-800">Total</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${routeIncomeData.ratePerStudent}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${routeIncomeData.totalIncome}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p className="mb-2">Note: {routeIncomeData.notes}</p>
                    <p>Payment calculation may vary based on actual attendance and school calendar.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  Error loading route income data
                </div>
              )}
            </motion.div>
          )}

          {/* Parent Payments Tab */}
          {activeTab === 'parentPayments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {parentPaymentsLoading ? (
                <Spinner />
              ) : parentPaymentsData ? (
                <>
                  <p className="text-sm text-gray-500 mb-6">
                    This tab shows payment status for parents on your routes. You don't need to collect payments directly, 
                    but this information helps you track which students have active accounts.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Total Students</div>
                      <div className="text-2xl font-semibold text-gray-800">{parentPaymentsData.total}</div>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                      <div className="text-sm text-green-700 mb-1">Paid</div>
                      <div className="text-2xl font-semibold text-green-600">{parentPaymentsData.paid}</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                      <div className="text-sm text-yellow-700 mb-1">Pending</div>
                      <div className="text-2xl font-semibold text-yellow-600">{parentPaymentsData.pending}</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                      <div className="text-sm text-red-700 mb-1">Overdue</div>
                      <div className="text-2xl font-semibold text-red-600">{parentPaymentsData.overdue}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <h4 className="font-medium text-gray-800 p-4 border-b border-gray-200">Recent Payment Activity</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Parent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {parentPaymentsData.recentActivity.map((activity, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{activity.parent}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{activity.student}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${activity.amount}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {renderStatusBadge(activity.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  Error loading parent payments data
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
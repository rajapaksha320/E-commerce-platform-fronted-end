/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import {
  X,
  Download,
  Printer,
  FileText,
  Package,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../ui/sellerUis/Uis";

const PrintOrderReport = ({ orders, config, onClose }) => {
  const printRef = useRef();

  const getCustomerName = (order) => {
    if (!order.shippingAddress) return "Unknown Customer";
    return order.shippingAddress.split(",")[0] || "Unknown Customer";
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return "background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;";
      case "confirmed":
        return "background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;";
      case "shipped":
        return "background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px;";
      case "delivered":
        return "background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px;";
      case "cancelled":
        return "background-color: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 12px;";
      default:
        return "background-color: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;";
    }
  };

  const renderRatingStars = (rating) => {
    if (!rating) return "No rating";
    return "★".repeat(rating) + "☆".repeat(5 - rating) + ` (${rating})`;
  };

  const calculateTotals = () => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
    };
  };

  const totals = calculateTotals();

  const generateHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Report - ${config.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: white;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
          }
          
          .header h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .header p {
            color: #6b7280;
            font-size: 16px;
          }
          
          .report-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .summary-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          
          .summary-card h3 {
            color: #6b7280;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          
          .summary-card .value {
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
          }
          
          .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .orders-table th {
            background: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .orders-table td {
            padding: 12px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
          }
          
          .orders-table tr:hover {
            background: #f9fafb;
          }
          
          .order-id {
            font-family: monospace;
            color: #3b82f6;
            font-weight: 500;
          }
          
          .customer-info {
            font-weight: 500;
            color: #1f2937;
          }
          
          .customer-shipping {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
          }
          
          .items-list {
            max-width: 200px;
          }
          
          .item {
            font-size: 13px;
            margin-bottom: 4px;
            padding: 2px 0;
          }
          
          .item-name {
            font-weight: 500;
            color: #1f2937;
          }
          
          .item-brand {
            color: #6b7280;
          }
          
          .amount {
            font-weight: 600;
            color: #059669;
          }
          
          .date {
            font-size: 13px;
            color: #6b7280;
          }
          
          .status-breakdown {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }
          
          .status-breakdown h3 {
            margin-bottom: 15px;
            color: #1f2937;
          }
          
          .status-breakdown div {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 10px;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          
          @media print {
            body {
              font-size: 12px;
            }
            
            .summary-cards {
              grid-template-columns: repeat(4, 1fr);
            }
            
            .orders-table {
              font-size: 11px;
            }
            
            .orders-table th,
            .orders-table td {
              padding: 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 ${config.title} Report</h1>
            <p>${config.description}</p>
          </div>
          
          <div class="report-info">
            <div>
              <strong>Report Generated:</strong> ${currentDate} at ${currentTime}
            </div>
            <div>
              <strong>Total Orders:</strong> ${totals.totalOrders}
            </div>
          </div>
          
          <div class="summary-cards">
            <div class="summary-card">
              <h3>Total Orders</h3>
              <div class="value">${totals.totalOrders}</div>
            </div>
            <div class="summary-card">
              <h3>Total Revenue</h3>
              <div class="value">LKR ${totals.totalRevenue.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h3>Average Order Value</h3>
              <div class="value">LKR ${totals.averageOrderValue.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h3>Report Type</h3>
              <div class="value" style="font-size: 16px;">${config.title}</div>
            </div>
          </div>
          
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                ${
                  config.showColumns.includes("rating") ? "<th>Rating</th>" : ""
                }
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .map(
                  (order) => `
                <tr>
                  <td class="order-id">${order._id}</td>
                  <td>
                    <div class="customer-info">${getCustomerName(order)}</div>
                    <div class="customer-shipping">${order.shippingOption}</div>
                  </td>
                  <td class="items-list">
                    ${
                      order.listings
                        ?.map(
                          (item) => `
                      <div class="item">
                        <div class="item-name">${item.title}</div>
                        <div class="item-brand">${item.brand}</div>
                      </div>
                    `
                        )
                        .join("") || "No items"
                    }
                  </td>
                  <td class="amount">LKR ${order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span style="${getStatusBadgeStyle(order.orderStatus)}">
                      ${
                        order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)
                      }
                    </span>
                  </td>
                  ${
                    config.showColumns.includes("rating")
                      ? `
                    <td>${renderRatingStars(order.orderRating)}</td>
                  `
                      : ""
                  }
                  <td class="date">${new Date(
                    order.createdAt
                  ).toLocaleDateString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="status-breakdown">
            <h3>📈 Status Breakdown</h3>
            ${Object.entries(totals.statusBreakdown)
              .map(
                ([status, count]) => `
              <div>
                <span style="${getStatusBadgeStyle(status)}">
                  ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}
                </span>
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="footer">
            <p>Generated from Seller Hub • ${new Date().toLocaleString()}</p>
            <p>This report contains ${
              totals.totalOrders
            } orders with a total value of LKR ${totals.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(generateHTML());
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownload = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-report-${config.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="2xl"
      title="Order Report Preview"
      hideCloseButton={false}
    >
      <ModalContent className="p-0">
        {/* Preview Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {config.title} Report
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Preview and download your order report
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {totals.totalOrders}
                </div>
                <div className="text-xs text-gray-600">Total Orders</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  LKR {totals.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Total Revenue</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  LKR {totals.averageOrderValue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Avg Order Value</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {orders.filter((o) => o.orderRating).length}
                </div>
                <div className="text-xs text-gray-600">Rated Orders</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Report Preview</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Report Type:</strong> {config.title}
              </p>
              <p>
                <strong>Total Orders:</strong> {totals.totalOrders}
              </p>
              <p>
                <strong>Date Range:</strong>{" "}
                {orders.length > 0
                  ? `${new Date(
                      Math.min(...orders.map((o) => new Date(o.createdAt)))
                    ).toLocaleDateString()} - 
                 ${new Date(
                   Math.max(...orders.map((o) => new Date(o.createdAt)))
                 ).toLocaleDateString()}`
                  : "No orders"}
              </p>
              <p>
                <strong>Generated:</strong> {new Date().toLocaleString()}
              </p>
            </div>

            {/* Status Breakdown */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Status Breakdown:
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(totals.statusBreakdown).map(
                  ([status, count]) => (
                    <span
                      key={status}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                      {count}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sample Orders Preview */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Sample Orders (showing first 3)
            </h3>
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        Order {order._id}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getCustomerName(order)} • LKR{" "}
                        {order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length > 3 && (
                <div className="text-center text-sm text-gray-500 py-2">
                  ... and {orders.length - 3} more orders
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalContent>

      {/* Action Buttons Footer */}
      <ModalFooter className="bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-600">
            Report includes {totals.totalOrders} orders
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Close Preview
            </Button>
            <Button
              variant="secondary"
              icon={<Printer />}
              onClick={handlePrint}
            >
              Print Report
            </Button>
            <Button
              variant="primary"
              icon={<Download />}
              onClick={handleDownload}
            >
              Download HTML
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PrintOrderReport;

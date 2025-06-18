import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Badge,
  ContactCard as Card,
} from "../../components/ui/ContactUis/Uis";
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';

const PaymentSection = ({ selectedPayment, onPaymentChange }) => {
  const [cardForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    saveCard: false,
  });

  // const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState({});
  const elements = useElements();
  const stripe = useStripe();

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      popular: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: Wallet,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      popular: false,
    },
    {
      id: "apple",
      name: "Apple Pay",
      description: "Touch ID or Face ID",
      icon: Smartphone,
      color: "text-gray-800",
      bgColor: "bg-gray-50",
      popular: false,
    },
    {
      id: "google",
      name: "Google Pay",
      description: "Pay with Google",
      icon: Smartphone,
      color: "text-green-600",
      bgColor: "bg-green-50",
      popular: false,
    },
  ];

  // const formatCardNumber = (value) => {
  //   const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  //   const matches = v.match(/\d{4,16}/g);
  //   const match = (matches && matches[0]) || "";
  //   const parts = [];

  //   for (let i = 0, len = match.length; i < len; i += 4) {
  //     parts.push(match.substring(i, i + 4));
  //   }

  //   if (parts.length) {
  //     return parts.join(" ");
  //   } else {
  //     return v;
  //   }
  // };

  // const formatExpiryDate = (value) => {
  //   const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  //   if (v.length >= 2) {
  //     return v.substring(0, 2) + "/" + v.substring(2, 4);
  //   }
  //   return v;
  // };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, "");
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6/.test(number)) return "discover";
    return null;
  };

  const handleCardFormChange = (field, value) => {
    console.log(`Field: ${field}, Value: ${value}`);
    
    // let formattedValue = value;

    // if (field === "cardNumber") {
    //   formattedValue = formatCardNumber(value);
    // } else if (field === "expiryDate") {
    //   formattedValue = formatExpiryDate(value);
    // } else if (field === "cvv") {
    //   formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4);
    // }

    // setCardForm((prev) => ({ ...prev, [field]: formattedValue }));

    // if (errors[field]) {
    //   setErrors((prev) => ({ ...prev, [field]: "" }));
    // }
  };

  const handleSubmit = async () => {
    try {
      console.log('hello');
      
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      console.log(`Card Number: ${cardNumberElement}`);
      console.log(`Card Expiry: ${cardExpiryElement}`);
      console.log(`Card CVC: ${cardCvcElement}`);


      const {token , error} = await stripe.createToken(cardNumberElement);

      if (error) {
        console.error("Error creating token:", error);
        setErrors((prev) => ({ ...prev, cardNumber: error.message }));
        return;
      }

      console.log(`Token: ${token.id}`);

    } catch (error) {
      console.log(error);

    }
  }

  const cardType = getCardType(cardForm.cardNumber);

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
            Payment Method
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600 mr-1" />
            <span>256-bit SSL encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedPayment === method.id;

            return (
              <div
                key={method.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                  }`}
                onClick={() => onPaymentChange(method.id)}
              >
                {method.popular && (
                  <div className="absolute -top-2 left-4">
                    <Badge variant="primary" size="sm">
                      Recommended
                    </Badge>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${isSelected ? method.bgColor : "bg-gray-50"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isSelected ? method.color : "text-gray-600"
                        }`}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                      }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Credit Card Form */}
      {selectedPayment === "card" && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Card Information
            </h3>
            <div className="flex items-center space-x-2">
              {cardType && (
                <img
                  src={`https://js.stripe.com/v3/fingerprinted/img/payment-methods/card-${cardType}-dark@2x.png`}
                  alt={cardType}
                  className="h-6 w-auto"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={cardForm.cardholderName}
                onChange={(e) =>
                  handleCardFormChange("cardholderName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.cardholderName ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter name as shown on card"
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cardholderName}
                </p>
              )}

            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              {/* <input
                type="text"
                value={cardForm.cardNumber}
                onChange={(e) =>
                  handleCardFormChange("cardNumber", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )} */}
              <CardNumberElement className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.cardholderName ? "border-red-500" : "border-gray-300"
                }`} />
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                {/* <input
                  type="text"
                  value={cardForm.expiryDate}
                  onChange={(e) =>
                    handleCardFormChange("expiryDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.expiryDate ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expiryDate}
                  </p>
                )} */}

                <CardExpiryElement className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.cardholderName ? "border-red-500" : "border-gray-300"
                  }`} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  CVV *
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    title="3 or 4 digit security code"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </label>
                <div className="relative">
                  {/* <input
                    type={showCvv ? "text" : "password"}
                    value={cardForm.cvv}
                    onChange={(e) =>
                      handleCardFormChange("cvv", e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="123"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCvv ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button> */}
                  <CardCvcElement className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.cardholderName ? "border-red-500" : "border-gray-300"
                    }`} />
                </div>
                {/* {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )} */}
              </div>
            </div>

            {/* Save Card Option */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="saveCard"
                checked={cardForm.saveCard}
                onChange={(e) =>
                  handleCardFormChange("saveCard", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                Save this card for future purchases
              </label>
            </div>

            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </Card>
      )}

      {/* PayPal */}
      {selectedPayment === "paypal" && (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              PayPal Payment
            </h3>
            <p className="text-gray-600 mb-6">
              You will be redirected to PayPal to complete your payment
              securely.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Continue with PayPal
            </Button>
          </div>
        </Card>
      )}

      {/* Apple Pay */}
      {selectedPayment === "apple" && (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-gray-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Apple Pay
            </h3>
            <p className="text-gray-600 mb-6">
              Use Touch ID or Face ID to pay securely with Apple Pay.
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800">
              Pay with Apple Pay
            </Button>
          </div>
        </Card>
      )}

      {/* Google Pay */}
      {selectedPayment === "google" && (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Google Pay
            </h3>
            <p className="text-gray-600 mb-6">
              Pay quickly and securely with Google Pay.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Pay with Google Pay
            </Button>
          </div>
        </Card>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">
              Your payment is secure
            </h4>
            <p className="text-sm text-green-700">
              We use industry-standard encryption to protect your payment
              information. Your card details are never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;

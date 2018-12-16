webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/CreateCashOrder.js":
/*!***************************************!*\
  !*** ./components/CreateCashOrder.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../routes */ "./routes.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_routes__WEBPACK_IMPORTED_MODULE_3__);


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js")("app:DEBUG"); //const config = require("config");





var fetch = __webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js");

var financial_institution_list = [{
  text: 'bankA',
  value: 'bankA'
}, {
  text: 'bankB',
  value: 'bankB'
}];

var CreateCashOrder =
/*#__PURE__*/
function (_Component) {
  _inherits(CreateCashOrder, _Component);

  function CreateCashOrder(props) {
    var _this;

    _classCallCheck(this, CreateCashOrder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateCashOrder).call(this, props)); //console.log(`Constructor:${props}`);
    //debug(`Constructor:${props.user}`);
    //debug(props);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "financial_institution_list", [{
      text: 'bankA',
      value: 'bankA'
    }, {
      text: 'bankB',
      value: 'bankB'
    }]);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "checkValue", function (event) {
      var r = event.target.value;
      var parseValue = Number.parseFloat(r);

      if (Number.isNaN(parseValue)) {
        _this.setState({
          value: ""
        });

        _this.setState({
          statusMessage: "numeric value"
        });

        return;
      }

      if (r.endsWith(".") || r.endsWith("0")) {
        parseValue = r;
      } else {
        parseValue = parseValue.toString();
      }

      _this.setState({
        value: parseValue
      });

      _this.setState({
        statusMessage: ""
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSubmit",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(event) {
        var headers, data, URL, response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event.preventDefault(); //avoid browser to auto-submit the form

                headers = {};
                headers["Content-Type"] = "application/json";
                data = {
                  userid: _this.state.user,
                  finEntity: _this.state.bank,
                  amount: _this.state.value,
                  DepositOrLoan: true
                };
                console.log(data);
                URL = "http://localhost:8001/api/ecashorder"; //config.get("ecashorder");

                _context.next = 8;
                return fetch(URL, {
                  method: 'POST',
                  mode: 'CORS',
                  body: JSON.stringify(data),
                  headers: headers
                });

              case 8:
                response = _context.sent;
                _context.t0 = console;
                _context.next = 12;
                return response.json();

              case 12:
                _context.t1 = _context.sent;

                _context.t0.log.call(_context.t0, _context.t1);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _this.state = {
      user: props.user,
      bank: "",
      eCashOrder: "",
      value: "",
      statusMessage: "",
      loading: false
    };
    return _this;
  }

  _createClass(CreateCashOrder, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log("componentDidMount:".concat(this.state.user));
      debug("componentDidMount:".concat(this.state.user));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h1", null, " ", this.state.user, " prepares eCash Order from a financial institution"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Form"], {
        onSubmit: this.onSubmit,
        error: this.state.statusMessage.length > 0
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Form"].Field, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", null, "Amount"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Input"], {
        label: "$",
        labelPosition: "left",
        placeholder: "numeric value",
        value: this.state.value,
        onChange: this.checkValue
      })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Form"].Field, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", null, "Financial institution"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Dropdown"], {
        placeholder: "Choose financial institution",
        fluid: true,
        selection: true,
        options: this.financial_institution_list,
        value: this.state.bank,
        onChange: function onChange(event, data) {
          _this2.setState({
            bank: event.target.value
          });
        }
      })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Form"].Field, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", null, "Remark"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Input"], {
        labelPosition: "right",
        placeholder: "Project description",
        value: this.value
      })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Button"], {
        loading: this.state.loading,
        primary: true,
        type: "submit"
      }, "Create!"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__["Message"], {
        error: true,
        header: "oops!",
        content: this.state.statusMessage
      })));
    }
  }]);

  return CreateCashOrder;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (CreateCashOrder);

/***/ })

})
//# sourceMappingURL=index.js.0a817d411e35442aa8db.hot-update.js.map
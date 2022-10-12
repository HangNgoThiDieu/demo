import { DefaultTheme } from "App";
import { createGlobalStyle } from "styled-components";
import icon_checked from "assets/images/icon_checked.svg";

//declare global colors
//Icon
export const ICON_COLOR = "#543005";
//Line
export const LINE_GRAY_DARK = "#A9A9A9";
export const LINE_GRAY = "#CACACA";
export const LINE_GRAY_WHITE = "#EFEDED";
//common
export const BACKGROUND = "#F7F7F7";
export const WHITE = "#FFFFFF";
export const BOX_SHADOW_COLORS = "#2b1616";
export const MENU_ICON_COLOR = "#543005";
export const TEXT_SUB_COLOR = "#57524C";
//end declare global colors

// declare global styles
export const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
  span,p, label, text {
    color: ${({ theme }) => theme.textColor};
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    word-break: break-word;
  }

  input, textarea, select {
    color: ${({ theme }) => theme.textColor};
  }

  span.accent_text, p.accent_text, label.accent_text, text.accent_text {
    color: ${({ theme }) => theme.accentColor};
    font-weight: 700;
    font-size: 14px;
    line-height: 21px;
  }

  span.sub_text, p.sub_text, div.sub_text {
    font-size: 10px;
    font-weight: 400;
    line-height: 1.5;
    color: ${TEXT_SUB_COLOR};
  }

  span.text_sub, p.text_sub {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    color: ${TEXT_SUB_COLOR};
  }

  p{
    margin: 0;
  }

  button {
    border-radius: 2px;
    border-width: 1px;
    font-weight: 700;
    width: 100%;
    padding: 7px 12px;
  }
  button.Toastify__close-button{
    width:auto;
  }
  
  button.btn_main {
    background-color: ${({ theme }) => theme.mainColor};
    color: ${WHITE};
    border: 1px solid ${({ theme }) => theme.mainColor};
  }

  a[type="button"].btn_main {
    background-color: ${({ theme }) => theme.mainColor};
    color: ${WHITE};
    border: 1px solid ${({ theme }) => theme.mainColor};
    text-align: center;
    text-decoration: none;
  }

  button.btn_sub {
    background-color: ${({ theme }) => theme.subColor};
    color: ${WHITE};
    border: 1px solid ${({ theme }) => theme.subColor};
  }

  button.btn_text_sub {
    background-color: ${WHITE};
    color: ${({ theme }) => theme.subColor};
    border: 1px solid ${({ theme }) => theme.subColor};
  }

  a[type="button"].btn_sub {
    background-color: ${({ theme }) => theme.subColor};
    color: ${WHITE};
    border: 1px solid ${({ theme }) => theme.subColor};
    text-align: center;
    text-decoration: none;
  }

  button.btn_white {
    background-color: ${WHITE};
    color: ${ICON_COLOR};
    border: 1px solid ${ICON_COLOR};
  }

  a[type="button"].btn_white {
    background-color: ${WHITE};
    color: ${ICON_COLOR};
    border: 1px solid ${ICON_COLOR};
    text-align: center;
    text-decoration: none;
  }

  button.btn_custom_main{
    border-radius: 100px;
    border: 1px solid ${({ theme }) => theme.mainColor};
    width: auto;
    font-weight: 700;
    font-size: 12px;
    padding: 2px 8px;
    background-color: ${({ theme }) => theme.mainColor};
    color: ${WHITE};
    line-height: 18px;
  }
  
  button.btn_custom_sub{
    border-radius: 100px;
    border: 1px solid ${LINE_GRAY_DARK};
    width: auto;
    font-weight: 700;
    font-size: 12px;
    padding: 2px 8px;
    background-color: ${LINE_GRAY_DARK};
    color: ${WHITE};
    line-height: 18px;
  }

  button.btn_custom_white{
    border-radius: 100px;
    border: 1px solid ${ICON_COLOR};
    width: auto;
    font-weight: 700;
    font-size: 12px;
    padding: 2px 8px;
    background-color: ${WHITE};
    color: ${ICON_COLOR};
    line-height: 18px;
  }

  button.btn_add_category{
    border-radius: 2px;
    border: 1px solid ${({ theme }) => theme.subColor};
    width: auto;
    font-weight: 700;
    font-size: 12px;
    padding: 7px 12px 7px 8px;
    background-color: ${WHITE};
    color: ${({ theme }) => theme.subColor};
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  span.text_title, p.text_title, label.text_title, text.text_title, a.text_title {
    color: ${({ theme }) => theme.textColor};
    font-size: 16px;
		font-weight: 700;
		line-height: 24px;
  }

  span.text_bold_14, p.text_bold_14, label.text_bold_14, text.text_bold_14, a.text_bold_14 {
    color: ${({ theme }) => theme.textColor};
    font-size: 14px;
		font-weight: 700;
		line-height: 21px;
  }

  span.text_number, p.text_number, label.text_number, text.text_number {
    color: ${({ theme }) => theme.textColor};
    font-size: 24px;
		font-weight: 700;
		line-height: 150%;
  }

  span.text_price, p.text_price, label.text_price, text.text_price {
    color: ${({ theme }) => theme.textColor};
    font-size: 20px;
		font-weight: 700;
		line-height: 150%;
  }

  span.text_small, p.text_small, label.text_small, text.text_small {
    color: ${({ theme }) => theme.textColor};
    font-size: 12px;
		font-weight: 400;
		line-height: 18px;
  }

  span.text_graph, p.text_graph, label.text_graph, text.text_graph {
    color: ${({ theme }) => theme.textColor};
    font-size: 9px;
		font-weight: 400;
		line-height: 18px;
  }
  span.text_6, p.text_6 label.text_6, text.text_6 {
    color: ${({ theme }) => theme.textColor};
    font-size: 6px;
		font-weight: 400;
		line-height: 18px;
  }
  span.text_16, p.text_16, label.text_16, text.text_16, a.text_16 {
    color: ${({ theme }) => theme.textColor};
    font-size: 16px;
		font-weight: 400;
		line-height: 24px;
  }

  label.title-name {
    color: ${({ theme }) => theme.textColor};
  }

  span.text-sub {
    color: ${({ theme }) => theme.textColor};
  }

  div.text-description {
    color: ${({ theme }) => theme.textColor};
  }

  span.active {
    text-decoration: none;
    color: ${({ theme }) => theme.mainColor};
  }

  div.menu-line {
    height: 2px;
    width: calc(100% / 4);
    background-color: ${({ theme }) => theme.mainColor};
  }

  li.menu-line {
    border-bottom: 2px solid ${({ theme }) => theme.mainColor};
    color: ${({ theme }) => theme.mainColor};
  }
  
  span.title_modal, p.title_modal, label.title_modal, text.title_modal {
    color: ${({ theme }) => theme.textColor};
    font-size: 18px;
		font-weight: 700;
		line-height: 27px;
  }

  .background_main{
    background-color: ${({ theme }) => theme.mainColor};
  }

  p.text_price {
    color: ${({ theme }) => theme.mainColor};
    font-size: 18px;
		font-weight: 700;
		line-height: 1.5;
  }

  span.price_tax_sold_out {
    font-size: 12px;
    font-weight: 400;
    color: ${LINE_GRAY_DARK};
  }

  p.text_price_sold_out {
    color: ${LINE_GRAY_DARK};
    font-size: 18px;
		font-weight: 700;
		line-height: 1.5;
  }

  p.text_bold, text.text_bold, span.text_bold {
		font-weight: 700;
  }

  label input[type="radio"] {
    display: none;
    color: ${({ theme }) => theme.textColor};
  }

  label input[type="radio"] + *::before {
    content: "";
    display: inline-block;
    vertical-align: bottom;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 50%;
    border-style: solid;
    border-width: 1px;
    border-color: ${LINE_GRAY};
    background: radial-gradient(
        ${LINE_GRAY} 0%,
        ${LINE_GRAY} 40%,
        transparent 50%,
        transparent
    );
  }

  label input[type="radio"]:checked + * {
    color: ${({ theme }) => theme.textColor};
  }

  label input[type="radio"]:checked + *::before {
    background: radial-gradient(
       ${({ theme }) => theme.mainColor} 0%,
       ${({ theme }) => theme.mainColor} 40%,
        transparent 50%,
        transparent
    );
    border-color: ${LINE_GRAY};
  }

  label input[type="checkbox"] {
    display: none;
    position: relative;
  }

  label input[type="checkbox"]:checked + * {
    color: ${({ theme }) => theme.textColor};
  }

  label input[type="checkbox"] + *::before {
    content: "";
    display: inline-block;
    vertical-align: bottom;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    border-color: ${LINE_GRAY_DARK};
    background-color: ${WHITE};
  }

  label input[type="checkbox"]:checked + *::before {
    background-image: url(${icon_checked});
    background-size: 16px 14px;
    background-repeat: no-repeat;
    background-position: center;
  }

  div.minus {
    background-color: ${({ theme }) => theme.subColor};
    outline: 0;
    transition: all .3s;
  }

  div.minus:active {
    transform: scale(.85);
  }

  div.plus {
    background-color: ${({ theme }) => theme.mainColor};
    outline: 0;
    transition: all .3s;
  }

  div.plus:active {
    transform: scale(.85);
  }
  
  .border_category_active {
    border-color: ${({ theme }) => theme.mainColor} !important;
  }

  .text_category_active {
    color: ${({ theme }) => theme.mainColor} !important;
  }

  .line_through_price {
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.subColor};
    position: absolute;
    top: 50%;
  }

  input, textarea, select, button {
    outline: none;
  }

  .carousel-indicators .active {
    background-color: ${({ theme }) => theme.mainColor} !important;
  }
  
  button {
    outline: 0;
    transition: all .3s;
  }

  button:active {
    transform: scale(.95);
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 55px;
    height: 29px;
  }
  
  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 21px;
    width: 21px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: ${({ theme }) => theme.mainColor};
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px ${({ theme }) => theme.mainColor};
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    background-image: none !important;
  }
  
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }

  div.image_delete {
    background: ${({ theme }) => theme.subColor};
    justify-content: center;
    display: flex;
    align-items: center;
    border-radius: 2px;
  }
  .label_status_cancel{
    background-color: ${({ theme }) => theme.mainColor};
    border: 1px solid ${({ theme }) => theme.mainColor};
    border-radius: 100px;
    padding: 2px 8px;
    color: ${WHITE};
    font-size: 12px;
  }
  .required_text{
    color: #ff0000;
  }
  .text_color_date {
    input{
      color: ${({ theme }) => theme.textColor};
    }
  }

  .text_menu {
    color: ${({ theme }) => theme.textColor};
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }

  pre {
    white-space: pre-wrap;
  }

  @media only screen and (max-width: 375px) {
    span.text_title, p.text_title, label.text_title, text.text_title, a.text_title {
      font-size: 14px;
      line-height: 21px;
    }

    .text_menu {
      color: ${({ theme }) => theme.textColor};
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
    }
  }

  @media only screen and (max-width: 330px) {
    span.text_title, p.text_title, label.text_title, text.text_title, a.text_title {
      font-size: 13px;
      line-height: 20px;
    }

    .text_menu {
      color: ${({ theme }) => theme.textColor};
      font-size: 13px;
      font-weight: 400;
      line-height: 20px;
  }
`;
//end declare global styles

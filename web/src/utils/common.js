// import { enqueueSnackbar } from 'notistack';
import { snackbarConstants } from '@/constants/SnackbarConstants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { API } from './api';
import { CHAT_LINKS } from '@/constants/chatLinks';
import { message } from 'antd';

export function getSystemName() {
  let system_name = localStorage.getItem('system_name');
  if (!system_name) return 'Chirou API';
  return system_name;
}

export function isMobile() {
  return window.innerWidth <= 600;
}

// eslint-disable-next-line
export function SnackbarHTMLContent({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export function getSnackbarOptions(variant) {
  // let options = snackbarConstants.Common[variant];
  // if (isMobile()) {
  //   // 合并 options 和 snackbarConstants.Mobile
  //   options = { ...options, ...snackbarConstants.Mobile };
  // }
  // return options;
  return String(variant).toLowerCase();
}

export function showError(error) {
  if (error.message) {
    if (error.name === 'AxiosError') {
      switch (error.response.status) {
        case 429:
          enqueueSnackbar('错误：请求次数过多，请稍后再试！', getSnackbarOptions('ERROR'));
          break;
        case 500:
          enqueueSnackbar('错误：服务器内部错误，请联系管理员！', getSnackbarOptions('ERROR'));
          break;
        case 405:
          enqueueSnackbar('本站仅作演示之用，无服务端！', getSnackbarOptions('INFO'));
          break;
        default:
          enqueueSnackbar('错误：' + error.message, getSnackbarOptions('ERROR'));
      }
    }
  } else {
    enqueueSnackbar('错误：' + error, getSnackbarOptions('ERROR'));
  }
}

export function showNotice(message, isHTML = false) {
  if (isHTML) {
    enqueueSnackbar(<SnackbarHTMLContent htmlContent={message} />, getSnackbarOptions('INFO'));
  } else {
    enqueueSnackbar(message, getSnackbarOptions('INFO'));
  }
}

export function showWarning(message) {
  enqueueSnackbar(message, getSnackbarOptions('WARNING'));
}

export function showSuccess(message) {
  enqueueSnackbar(message, getSnackbarOptions('SUCCESS'));
}

export function showInfo(message) {
  enqueueSnackbar(message, getSnackbarOptions('INFO'));
}

export function copy(text, name = '') {
  try {
    navigator.clipboard.writeText(text);
  } catch (error) {
    text = `复制${name}失败，请手动复制：<br /><br />${text}`;
    enqueueSnackbar(<SnackbarHTMLContent htmlContent={text} />, getSnackbarOptions('COPY'));
    return;
  }
  showSuccess(`复制${name}成功！`);
}

export async function getOAuthState() {
  try {
    const res = await API.get('/api/oauth/state');
    const { success, message, data } = res.data;
    if (success) {
      return data;
    } else {
      showError(message);
      return '';
    }
  } catch (error) {
    return '';
  }
}

export async function onGitHubOAuthClicked(github_client_id, openInNewTab = false, githubLoading, setGithubLoading) {
  setGithubLoading(true);
  const state = await getOAuthState();
  if (!state) {
    setGithubLoading(false);
    return;
  }
  let url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&state=${state}&scope=user:email`;
  if (openInNewTab) {
    window.open(url);
  } else {
    window.location.href = url;
  }
}

export async function getOIDCEndpoint() {
  try {
    const res = await API.get('/api/oauth/endpoint');
    const { success, message, data } = res.data;
    if (success) {
      return data;
    } else {
      showError(message);
      return '';
    }
  } catch (error) {
    return '';
  }
}

export async function onOIDCAuthClicked(openInNewTab = false) {
  const url = await getOIDCEndpoint();
  if (!url) return;
  if (openInNewTab) {
    window.open(url);
  } else {
    window.location.href = url;
  }
}

export async function onLarkOAuthClicked(lark_client_id) {
  const state = await getOAuthState();
  if (!state) return;
  let redirect_uri = `${window.location.origin}/oauth/lark`;
  window.open(`https://open.feishu.cn/open-apis/authen/v1/authorize?redirect_uri=${redirect_uri}&app_id=${lark_client_id}&state=${state}`);
}

export function isAdmin() {
  let user = localStorage.getItem('user');
  if (!user) return false;
  user = JSON.parse(user);
  return user.role >= 10;
}

export function timestamp2string(timestamp) {
  let date = new Date(timestamp * 1000);
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  let hour = date.getHours().toString();
  let minute = date.getMinutes().toString();
  let second = date.getSeconds().toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  if (hour.length === 1) {
    hour = '0' + hour;
  }
  if (minute.length === 1) {
    minute = '0' + minute;
  }
  if (second.length === 1) {
    second = '0' + second;
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

export function calculateQuota(quota, digits = 2) {
  let quotaPerUnit = localStorage.getItem('quota_per_unit');
  quotaPerUnit = parseFloat(quotaPerUnit);

  return (quota / quotaPerUnit).toFixed(digits);
}

export function renderQuota(quota, digits = 2) {
  let displayInCurrency = localStorage.getItem('display_in_currency');
  displayInCurrency = displayInCurrency === 'true';
  if (displayInCurrency) {
    return calculateQuota(quota, digits);
  }
  return renderNumber(quota);
}

export const verifyJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function renderNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 10000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num;
  }
}

export function renderQuotaWithPrompt(quota = 0, digits = 6) {
  let displayInCurrency = localStorage.getItem('display_in_currency');
  displayInCurrency = displayInCurrency === 'true';
  if (displayInCurrency) {
    return `等价额度($)：${renderQuota(quota, digits)}`;
  }
  return '';
}

export function downloadTextAsFile(text, filename) {
  let blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export function removeTrailingSlash(url) {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  } else {
    return url;
  }
}

export function trims(values) {
  if (typeof values === 'string') {
    return values.trim();
  }

  if (Array.isArray(values)) {
    return values.map((value) => trims(value));
  }

  if (typeof values === 'object') {
    let newValues = {};
    for (let key in values) {
      newValues[key] = trims(values[key]);
    }
    return newValues;
  }

  return values;
}

// LinkDO auth
export async function onLinuxDOAuthClicked(linuxdo_client_id, openInNewTab, linuxDoLoading, setLinuxDoLoading) {
  setLinuxDoLoading(true);
  const state = await getOAuthState();
  if (!state) {
    setLinuxDoLoading(false);
    return;
  }
  let url = `https://connect.linux.do/oauth2/authorize?client_id=${linuxdo_client_id}&response_type=code&state=${state}&scope=user:profile`;
  if (openInNewTab) {
    window.open(url);
  } else {
    window.location.href = url;
  }
}

export function getChatLinks(filterShow = false) {
  let links;
  let siteInfo = JSON.parse(localStorage.getItem('siteInfo'));
  let chatLinks = JSON.parse(siteInfo?.chat_links || '[]');

  if (chatLinks.length === 0) {
    links = CHAT_LINKS;
    if (siteInfo?.chat_link) {
      // 循环找到name为ChatGPT Next的链接
      for (let i = 0; i < links.length; i++) {
        if (links[i].name === 'ChatGPT Next') {
          links[i].url = siteInfo.chat_link + `/#/?settings={"key":"sk-{key}","url":"{server}"}`;
          links[i].show = true;
          break;
        }
      }
    }
  } else {
    links = chatLinks;
  }

  if (filterShow) {
    links = links.filter((link) => link.show);
  }
  // 对links进行排序，sort为空的项排在最后
  links.sort((a, b) => {
    if (!a?.sort) return 1;
    if (!b?.sort) return -1;
    return b.sort - a.sort;
  });
  return links;
}

export function replaceChatPlaceholders(text, key, server) {
  return text.replace('{key}', key).replace('{server}', server);
}

function enqueueSnackbar(content, type = 'success') {
  if (type === 'info') {
    message.info({
      content: content
    });
  }
  if (type === 'error') {
    message.error({
      content: content
    });
  }
  if (type === 'success') {
    message.success({
      content: content
    });
  }
}

export function useStateWithCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((newState, cb) => {
    cbRef.current = cb;
    setState(newState);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}



export function stringToRGB(str = '', opacity = 1) {
  let hash = 0;
  // Create a hash from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Calculate RGB values
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function stringToTagColor(str = '') {
  if (str === 'default') {
    return 'blue';
  }
  const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'purple'];
  let hash = 0;

  // Create a hash from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map the hash to a color index
  const colorIndex = Math.abs(hash) % colors.length;

  return colors[colorIndex];
}
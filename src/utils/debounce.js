/**
 * Debounce utility function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to trigger the function on the leading edge instead of the trailing edge
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

/**
 * Create a debounced version of a function with cancellation support
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} options - Options object
 * @param {boolean} options.leading - Specify invoking on the leading edge of the timeout
 * @param {boolean} options.trailing - Specify invoking on the trailing edge of the timeout
 * @param {number} options.maxWait - The maximum time func is allowed to be delayed before it's invoked
 * @returns {Function} - The debounced function with cancel method
 */
export const debounceAdvanced = (func, wait, options = {}) => {
  const { leading = false, trailing = true, maxWait } = options;
  
  let lastCallTime;
  let lastInvokeTime = 0;
  let timerId;
  let lastArgs;
  let lastThis;
  let result;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    
    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }
  
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  
  function trailingEdge(time) {
    timerId = undefined;
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  
  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }
  
  function pending() {
    return timerId !== undefined;
  }
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  
  return debounced;
};

/**
 * Simple throttle function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to throttle
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Create a debounced async function
 * @param {Function} asyncFunc - The async function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced async function
 */
export const debounceAsync = (asyncFunc, wait) => {
  let timeout;
  let resolveList = [];
  let rejectList = [];
  
  return function(...args) {
    return new Promise((resolve, reject) => {
      resolveList.push(resolve);
      rejectList.push(reject);
      
      clearTimeout(timeout);
      
      timeout = setTimeout(async () => {
        const currentResolveList = resolveList.slice();
        const currentRejectList = rejectList.slice();
        
        resolveList = [];
        rejectList = [];
        
        try {
          const result = await asyncFunc.apply(this, args);
          currentResolveList.forEach(resolve => resolve(result));
        } catch (error) {
          currentRejectList.forEach(reject => reject(error));
        }
      }, wait);
    });
  };
};

export default {
  debounce,
  debounceAdvanced,
  throttle,
  debounceAsync,
};
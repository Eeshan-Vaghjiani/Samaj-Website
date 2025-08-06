/*
              NOTES: NOT IMPLEMENTED OR JUST NOTES.
  
  1. Fetching request needs to be handled by server-side script.
      - JavaScript requests the server for members list, instead of directly accessing the JSON file.

  2. Server-side script must not respond with full members list.
      - Send a filtered list with members that satisfy the requested year or other parameters.

  3. If member's list is stored in JSON format, then:
      - It may be sorted in asc. or desc. order based on any parameters (i.e. by fName, by relievedOn, or by combination of multiple parameters).
      - Indexing: Scanning and storing data from array of member's objects. May be an index list based on most searched parameter (i.e. fName) and then sorting. (HASHING).

  4. Improve the search functionality.
      - Ranking: Returning results in order of relevance.
      - Indexing: Scanning and storing data from array of member's objects.
      - Debug the filtering method to find possible bugs.
      - Fix the timing of input and debounce function. Results are still being fetched even after the user presses backspace to remove the query completely.

*/

// DOM Elements variable declaration.
const URL_CURRENT_MEMBERS = '../data/members/current_members.json';
const URL_NOT_MEMBERS = "../data/members/not-members.json";
const URL_NOT_MEMBERS_SEARCH = "../data/members/not-members-search-test.json";


const defaultProfilePic = "../assets/images/Board And Management/default-man-avatar.PNG";
let MembersListMap = new Map(); // After fetching members list, store here.
const debounceTimers = {}; // Store all debounce timers by key.


const searchControlsElm = document.getElementById('controls__search'); // Intire search-bar container.

const MembersListElms = {
  'BOARD MEMBERS': document.getElementById('board-members'),
  'SAMAJ TRUSTEE': document.getElementById('trustees'),
  'TRUST TRUSTEE': document.getElementById('trust-trustees'),
  'BOARD OF GOVERNORS': document.getElementById('governors'),
  'YOUTH LEAGUE': document.getElementById('youth-league'),
  'SUB COMMITTEE': document.getElementById('committee-convenors'),
  'GAAM REPRESENTATIVES': document.getElementById('gaam-representatives'),
  'SEARCH': document.getElementById('search__results') // Container for displaying available search results.
};

// Manage listeners for every section.
const SectionsListener = {
  'BOARD MEMBERS': [{ isActive: false, target: MembersListElms['BOARD MEMBERS'], event: 'click', handler: openShowMoreOverlay }],
  'SAMAJ TRUSTEE': [{ isActive: false, target: MembersListElms['SAMAJ TRUSTEE'], event: 'click', handler: openShowMoreOverlay }],
  'TRUST TRUSTEE': [{ isActive: false, target: MembersListElms['TRUST TRUSTEE'], event: 'click', handler: openShowMoreOverlay }],
  'BOARD OF GOVERNORS': [{ isActive: false, target: MembersListElms['BOARD OF GOVERNORS'], event: 'click', handler: openShowMoreOverlay }],
  'YOUTH LEAGUE': [{ isActive: false, target: MembersListElms['YOUTH LEAGUE'], event: 'click', handler: openShowMoreOverlay }],
  'SUB COMMITTEE': [{ isActive: false, target: MembersListElms['SUB COMMITTEE'], event: 'click', handler: openShowMoreOverlay }],
  'GAAM REPRESENTATIVES': [{ isActive: false, target: MembersListElms['GAAM REPRESENTATIVES'], event: 'click', handler: openShowMoreOverlay }],
  SEARCH: [
    { isActive: false, target: MembersListElms['SEARCH'] , event: 'click', handler: filterBySelectedResultYear },
    { isActive: false, target: document.getElementById('search__here'), event: 'input', handler: SearchInputHandler },
    { isActive: false, target: document.getElementById('controls__search'), event: 'focusin', handler: SearchFocusInHandler },
    { isActive: false, target: document.getElementById('controls__search'), event: 'focusout', handler: SearchFocusOutHandler }
  ]
};

/**
 * Debounce utility to delay execution of a callback function.
 * Useful for optimizing performance during events that fire frequently, such as user input or focus state.
 *
 * @param {string} key - Unique key to identify the debounce timer records.
 * @param {Function} callback - The function to be debounced.
 * @param {number} [delay=300] - Delay in milliseconds before executing callback.
 */
const debounceFn = (key, callback, delay = 300) => {
  clearTimeout(debounceTimers[key]);

  debounceTimers[key] = setTimeout(() => {    
    callback();
    delete debounceTimers[key];
  }, delay);
}


/**
 * Toggles the loading state indicator for specified sections by adding or removing a 'load' class.
 * 
 * @param {string} section - The key name of the target section (e.g., 'SCLP', 'CHARITABLE', 'SEARCH').
 *                           Determines which element's loading state should be toggled.
 * 
 * @example
 * toggleLoadingState('SCLP');        // Toggles loading on the SCLP members list
 */

const toggleLoadingState = (section = '') => { MembersListElms[section]?.classList.toggle('load'); }

/**
 * Renders a message inside the specified member list section (e.g., 'SCLP' or 'Charitable').
 * Useful for displaying empty states, errors, or status updates.
 *
 * @param {string} section - Key corresponding to the section in MembersListElms where the message should appear.
 * @param {string} [message='No results!'] - The message content to display.
 * @param {boolean} [isError=false] - Whether the message represents an error (adds 'error' class if true).
 */
const renderMessage = (section = '', message = 'No results!', isError = false) => {
  MembersListElms[section].innerHTML = `<li class="message ${isError ? 'error' : ''}"><p>${message}</p></li>`;  
}

/**
 * Checks if a list is empty. If it is, renders a fallback message and removes any associated listeners.
 *
 * @param {Array} list - The filtered list to check (e.g., search results or member cards).
 * @param {string} section - A key from the SectionsListeners object (e.g., 'SEARCH' or 'SCLP').
 * @param {string} message - A message to display if the list is empty.
 */
const assertIsEmpty = (list, section, message) => {
  list.length || (
    renderMessage(section, message),
    toggleListener(section, 0, false)
  );
}

/**
 * Attach or detach event listener to or from a given target.
 * 
 * @param {string} section - The key of the SectionsListeners object (e.g. 'SEARCH' or 'SCLP'). 
 * @param {number} index - The index of the listener inside section's array.
 * @param {boolean} enable - Whether to attach (true) or remove (false) the listeners.
 * 
 */

const toggleListener = (section, index = 0, enable = true) => {
  const { isActive, target, event, handler } = SectionsListener[section][index];
  if (isActive == enable) return;
  target[enable ? 'addEventListener' : 'removeEventListener'](event, handler);
  SectionsListener[section][index].isActive = enable;
}
/**
 * Formats a raw member object into a simplified structure suitable for rendering.
 * 
 * @param {Object} member - The raw member object.
 * @returns {Object} An object with the simplified structure:
 */
const formatMemberInfo = (member) => {

  // Extract values from the member object.
  const { id, appointedOn, relievedOn, department, profilePic, title, position, ...names } = member;

  // Check if profilePic is undefined, null, empty string, or doesn't exist
  const validProfilePic = profilePic && profilePic.trim() !== "" ? profilePic : defaultProfilePic;

  return {
    id, department,
    fullName: Object.values(names).join(" ").trim(),
    position: position || title || "",
    yearRange: appointedOn == relievedOn ? appointedOn : `${appointedOn} - ${relievedOn}`,
    imgSrc: validProfilePic
  };
}

/**
 * Attach a one-time 'load' event listener to an image element to trigger a lazy loading logic.
 * When the image finishes loading, a 'loaded' class is added to its parent element,
 * typically to apply visual transitions such as fade-in or removing a placeholder.
 *
 * @param {HTMLImageElement} element - The image element to monitor for loading.
 */
const handleLazyLoading = (element) => {
  // If it's already the default profile pic, mark as loaded immediately
  if (element.src === defaultProfilePic || element.src.endsWith('default-man-avatar.PNG')) {
    element.parentElement.classList.add('loaded');
    return;
  }

  element.addEventListener('load', (event) => {
    event.target.parentElement.classList.add('loaded');
  }, { once: true });

  // Add error handler to replace broken images with default profile picture
  element.addEventListener('error', (event) => {
    event.target.src = defaultProfilePic;
    // Mark as loaded immediately since we know the default image exists
    event.target.parentElement.classList.add('loaded');
  }, { once: true });
}

/**
 * Creates and returns a DOM element representing a board member card. Attaches a one-time 'load' event listener to the image element for lazy loading logic.
 * 
 * @param {Object} member - The member object containing profile and service information.
 * @param {boolean} isSearchResult - Flag indicating if the card is for search results (affects layout and structure).
 * @returns {HTMLLIElement} A list item element representing the member card.
 */

const createMemberCardHTML = (member, isSearchResult = false) => {

  const { id, fullName, position, yearRange, imgSrc } = formatMemberInfo(member);

  const imgAltText = isSearchResult ? 'search-' + fullName : fullName;

  // Create HTML for the card.
  const li = document.createElement('li');

  li.dataset.id = id;

  if (isSearchResult) li.dataset.year = member.appointedOn; // Later used to populate members list.

  li.innerHTML = `
    <article>
      <figure>
        <img loading="lazy" src="${imgSrc}" alt="${imgAltText}"> 
      </figure>

      <div class="members__description">
        <h5>${fullName}</h5>
        <div class="position-info">
          <span>${position}</span>
          <span>${yearRange}</span>
        </div>
      </div>
    </article>
  `;

  handleLazyLoading(li.querySelector('img')); // Lazy loading logic.

  return li;

}
/**
 * Renders the provided list of member objects inside the search results container.
 * 
 * If the list is empty, displays a fallback message and removes event listeners if needed.
 * Otherwise, populates the container with search result items and sets up interaction handlers.
 * 
 * @param {Array<Object>} filteredList - An array of member objects matching the search query.
 */
const renderSearchMembersList = (filteredList = []) => {

  // Clear old list/message from DOM.
  const block = MembersListElms['SEARCH'];

  block.innerHTML = '';

  // Show the filtered results.
  filteredList.forEach(member => block.appendChild(createMemberCardHTML(member, true)));

  // Add listener to select a member profile.
  toggleListener('SEARCH');

  // Hide loading icon.
  toggleLoadingState('SEARCH');

  assertIsEmpty(filteredList, 'SEARCH');
}

/**
 * Renders the provided list of member objects into their respective containers
 * based on department (e.g., 'SCLP' or 'Charitable').
 * 
 * Displays a "No results" message if the list is empty and removes related listeners.
 *
 * @param {Array<Object>} filteredList - An array of member objects to be rendered.
 */
const renderMembersList = (filteredList = []) => {
  // First, remove all loading states
  Object.keys(MembersListElms).forEach(key => {
    if (key !== 'SEARCH') {
      MembersListElms[key].classList.remove('load');
      MembersListElms[key].innerHTML = '';
    }
  });

  // Show the filtered results.
  filteredList.forEach(member => {
    const dept = member.department ? member.department.toUpperCase() : null;
    if (dept && dept !== 'SEARCH' && MembersListElms[dept]) {
      MembersListElms[dept].appendChild(createMemberCardHTML(member));
    }
  });

  // Add listeners to select a member profile for each section
  Object.keys(MembersListElms).forEach(key => {
    if (key !== 'SEARCH') {
      toggleListener(key);
      // Only show empty message if there are no members for this department
      assertIsEmpty(filteredList.filter(m => m.department && m.department.toUpperCase() === key), key);
    }
  });

}
/**
 * Fetches member data from the given source URL and returns a Promise with the result.
 *
 * This function handles HTTP errors and wraps the fetched data in a custom response object.
 * It expects the response to be a JSON array of member objects.
 *
 * @param {string} sourceURL - The URL to fetch the members data from.
 * @returns {Promise<Object>} A promise that resolves to an object with `status` and `members` keys.
 *                            On success: { status: 1, members: Array<Object> }
 *                            On failure: rejected with { status: 0, message: string }
 *
 */
const fetchDataFromSource = async (sourceURL) => {
  const response = await fetch(sourceURL);

  if (!response.ok) throw { status: 0, message: new Error("Error! Please try again later.").message };

  const data = await response.json(); // Content of data: Array of member object.

  return { status: 1, members: data };
}


/**
 * Filters the MembersListMap based on the provided year.
 *
 * @param {number} selectedYear - The year to filter members by. A member is included if the year falls between their appointedOn and relievedOn (inclusive).
 * @returns {Array<Object>} An array of member objects that match the filter, or an empty array if none match.
 */
const filterByYear = (selectedYear) => { // NOT the best method to filter. CHANGE LATER.
  const results = [];

  for (const [id, member] of MembersListMap) {
    const startYear = parseInt(member.appointedOn);
    const endYear = parseInt(member.relievedOn);

    if (selectedYear >= startYear && selectedYear <= endYear) results.push(member);
  }

  return results;
}


/**
 * Filters the MembersListMap based on the first name, last name, or a combination of both (in that order).
 * 
 * Note: Matching with last name followed by first name is not implemented.
 *
 * @param {string} query - The search string used to match against member names.
 * @returns {Array<Object>} An array of matching member objects, or an empty array if no matches are found.
 */
const filterByName = (query = "") => { // NOT the best method to filter. CHANGE LATER.

  // Show loading icon.
  toggleLoadingState('SEARCH');
  // Separate query into sub-strings if it has spaces.
  const searchTerms = query.split(" ");

  const results = [];

  for (const [id, member] of MembersListMap) {
    // Convert stored member's first name and last name to lowercase.
    const fName = member.fName.toLowerCase();
    const lName = member.lName.toLowerCase();

    // If the query contains only one word.
    if (searchTerms.length == 1) if (fName.includes(searchTerms[0]) || lName.includes(searchTerms[0])) results.push(member);

    // If the query contains multiple words, check if both search terms matches the record.
    // NOTE: reverse may be true, first term can be last name.
    if (searchTerms.length >= 2) if(fName.includes(searchTerms[0]) && lName.includes(searchTerms[1])) results.push(member);
  
  }

  return results;
}

/**
 * Handles displaying the member details overlay with the provided profile information.
 * Updates the overlay content (image, name, department, and years of service),
 * resets scroll position, disables body scrolling, and attaches close listeners.
 * 
 * @param {Event} event - The click event from the SCLP or Charitable members list container.
*/
function openShowMoreOverlay(event) {
  if (!event.target.matches('img')) return; // Only react if the clicked target is an <img>.

  // Traverse to get the <li> element and get the data 'id'.
  const memberID = parseInt(event.target.closest('li').dataset?.id ?? 0);

  const member = MembersListMap.get(memberID);
  if (!member) return;

  const {id, fullName, position, imgSrc, yearRange } = formatMemberInfo(member);

  const overlayElm = document.querySelector('.board-directory__overlay');
  const imgElm = overlayElm.querySelector('.overview__avatar img');
  const descriptionElm = overlayElm.querySelector('.members__description');
  
  overlayElm.dataset['id'] = id;
  imgElm.src = imgSrc;
  
  // Update the member info in the overlay
  descriptionElm.querySelector('h5').innerHTML = fullName;
  const positionInfo = descriptionElm.querySelector('.position-info');
  positionInfo.querySelector('span:first-child').innerHTML = position;
  positionInfo.querySelector('span:last-child').innerHTML = yearRange;

  handleLazyLoading(imgElm); // Lazy loading logic.
 
  // Hide the scrollbar of the body.
  document.body.style.overflow = 'hidden';

  // Since the overlay is reused for every member card, the scroll position needs to be reset for every call to open it.
  overlayElm.querySelector('.scrollable').scrollTop = 0;
  overlayElm.classList.add('active-overlay');


  overlayElm.querySelector('button.close').addEventListener('click', () => {

    overlayElm.classList.remove('active-overlay');
    /* Wait for transition to complete and then show the body scrollbar */
    overlayElm.addEventListener('transitionend', () => {
      document.body.style.overflow = '';
    }, { once: true });
    
    setTimeout(() => { document.body.style.overflow = ''; }, 300); // Fallback if transitions are disabled.

  }, { once: true });

}

/**
 * Handles the selection of a search result by extracting the year from the clicked result item.
 * Triggers filtering of the member list based on the selected year and updates the year filter UI.
 * Ensures focus is removed from the currently active element (usually the search results container).
 *
 * @param {Event} event - The click event from the search results container.
 */

function filterBySelectedResultYear (event) {

  // Traverse the clicked element to get year from card's <li> element.
  const year = event.target.closest('li').dataset?.year ?? 0;

  if (!year) return;

  renderMembersList(filterByYear(year)); // Filter records and show them.

  if (document.activeElement) document.activeElement.blur(); // Remove current focus.

  document.querySelector('#year-filter select').value = year; // Update the selected option.

}

/**
 * Handles input events from the search field. Applies trimming and minimum length checks
 * before invoking a debounced search to filter and display relevant member results.
 *
 * @param {Event} event - The input event from the search field.
 */

function SearchInputHandler(event) {
  const query = event.target.value.trim().toLowerCase();

   // Remove the listener if it had one and show the message.
  if (!query || query.length < 3) return assertIsEmpty([], 'SEARCH', 'Try searching!');

  // Not ideal to filter records upon every key pressed, wait for user to type atleast 3 to 4 characters.
  debounceFn('input', () => renderSearchMembersList(filterByName(query)), 1000);
}

/**
 * Adds the 'active' class to the search bar container when it receives focus.
*/
function SearchFocusInHandler(event) { event.currentTarget.parentElement.classList.add('active'); }

/**
 * Removes the 'active' class from the search bar container when focus moves
 * outside of it (i.e., neither input nor result list is focused anymore),
 * but only if it is not focused.
 *
 * A delay is added to ensure the check occurs after focus has shifted and
 * to allow smooth transitions before removing the class. Above 400ms delay is necessary to prevent layout shifts.
 */
function SearchFocusOutHandler(event) {
  const searchElm = event.currentTarget;

  debounceFn('focus', () => { // Wait for the search bar transition to complete, to avoid any sibling elements to jump to next row.
    if (searchElm.contains(document.activeElement)) return; // If the focus is within, return.
    searchElm.parentElement.classList.remove('active'); 
  }, 500);
}

/*                                                   
                                        THE BEGINNING                                                                  
*/

/**
 * Filters and renders the members list based on the selected year from the UI dropdown.
 * This function is triggered via the `onchange` event directly in the HTML `<select>` element.
 *
 * @param {Event} event - The change event triggered when a new year is selected from the dropdown.
 */
const filterMembersByYear = (event) => { renderMembersList(filterByYear(event.target.value)); }

/**
 * ===============================================================
 * ENTRY POINT — BOARD DIRECTORY PAGE INITIALIZATION
 * ===============================================================
 * 
 * This script runs once the DOM is fully loaded. It performs the
 * following key operations:
 * 
 * 1. Retrieves the initially selected year from the UI dropdown.
 * 2. Fetches board members data from a local JSON source.
 * 3. Stores the fetched members into a Map using their unique IDs.
 * 4. Filters and renders members based on the selected year.
 * 5. Activates all search bar listeners.
 * 6. Handles and displays errors gracefully if fetching fails.
 * 
 * This marks the entry point and setup phase for the dynamic
 * board directory interface.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch members data.
  try {
    const response = await fetchDataFromSource(URL_CURRENT_MEMBERS);

    // Copy the data to the map.
    response.members.forEach(member => MembersListMap.set(member.id, member));

    // Get the default selected year.
    const selectedYear = document.getElementById('year-served').value;

    renderMembersList(filterByYear(selectedYear));

    // Add all listeners associated with search bar (input, focusin, focusout).
    for (let i = 1; i < 4; i++) toggleListener('SEARCH', i);

    
  } catch (error) {
    // Show error message in all department sections
    Object.keys(MembersListElms).forEach(key => {
      if (key !== 'SEARCH') {
        renderMessage(key, error.message, true);
      }
    });
  }

})

// Handler to capture keyboard events, act only when Esc key pressed. TEMPORARY.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  
  // Remove focus from any element.
  document.activeElement.blur();

  // If overlay is open, close it.
  if (document.querySelector('.board-directory__overlay.active-overlay'))
    document.querySelector('.active-overlay button.close').click();
})

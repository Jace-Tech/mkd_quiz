const rangesResponsesContainer = document.getElementById('ranges-responses-container');
function addRangeResponse(e, el) {
  e.preventDefault();
  let nextBoxId = parseInt(el.dataset.next);
  let rangeResponseHtmlTemplate = `
      <div class="d-flex flex-row col-12 px-0 align-items-end" data-box-id="${nextBoxId}">
          <div class="form-group col-2 pl-0">
              <label for="range_${nextBoxId}" class="control-label">Range</label>
              <input type="text" class="form-control data-input"
              id="range_${nextBoxId}"
              placeholder="0-20" 
              name="ranges" value="" />
          </div>
          <div class="form-group col-6 pl-0">
              <label for="response_${nextBoxId}" class="control-label">Response</label>
              <input type="text" class="form-control data-input"
              id="response_${nextBoxId}"
              placeholder="Response to accumlated weight between 0% and 20%" 
              name="responses" value="" />
          </div>
          <button type="button" onclick="addRangeResponse(event, this)" class="form-group my-0 col-2 btn btn-primary mb-3" style="height:max-content;height:-moz-max-content" data-next="${nextBoxId + 1}">
              Add
          </button>
          <button type="button" onclick="removeRange(event, this)" class="form-group my-0 col-2 btn btn-danger mb-3 mx-1" style="height:max-content;height:-moz-max-content" data-box-id="${nextBoxId}">
              Del
          </button>
      </div>
    `;
  $(rangesResponsesContainer).append(rangeResponseHtmlTemplate);
}
function removeRange(e, el) {
  e.preventDefault();
  let boxToRemoveId = parseInt(el.dataset.boxId);
  document.querySelector(`div[data-box-id="${boxToRemoveId}"]`).remove();
}

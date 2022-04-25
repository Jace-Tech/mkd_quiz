'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Result_profile Paginate List View Model
 *
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 */

module.exports = function (entity, pageName, success, error, baseUrl) {
    this.success =  success ? success : "";
    this.error =  error ? error : "";
    this._list = [];
    this._column = ['ID','Section title','Variables List','Action'];
    this._readable_column = ["ID","Section title","Variables List"];
    this._entity = entity;
    this._heading = 'Result profile';
    this._base_url = baseUrl.endsWith('/') ? baseUrl.substring(0, -1) : baseUrl;
    this._query = {};
    this._total_rows = 0;
    this._format_layout = '';
    this._per_page = 10;
    this._page;
    this._num_links = 5;
    this._field_column = ['id','section_title','output_variable_list'];
    this._readable_field_column = ["id","section_title","output_variable_list"]
    this._links = '';
    this._sort_base_url = '';
    this._order_by = '';
    this._sort = '';
    this._link_types =  {'start': 'start', 'prev': 'prev', 'next': 'next'};
    this._attributes = ' class="page-link"';
    this.reuse_query_string = true;
    this.page_query_string = true;
    this.full_tag_open = '';
    this.full_tag_close = '';
    this.attributes = '';
    this.first_link = '';
    this.last_link = '';
    this.first_tag_open = '';
    this.query_string_segment = 'per_page';
    this.first_tag_close = '';
    this.prev_link = '';
    this.prev_tag_open = '';
    this.prev_tag_close = '';
    this.next_link = '';
    this.next_tag_open = '';
    this.next_tag_close = '';
    this.last_tag_open = '';
    this.last_tag_close = '';
    this.cur_tag_open = '';
    this.cur_tag_close = '';
    this.num_tag_open = '';
    this.num_tag_close = '';
    this.suffix = '';
    this.prefix = '';
    this.cur_page = 0;


    this.get_page_name = () => pageName


    this.get_heading = function () {
      return pageName;
    };

    this.get_column = function () {
      return this._column;
    };

    this.get_readable_column = function () {
      return this._readable_column;
    };

    this.set_list = function (list) {
      this._list = list;
    };

    this.set_query = function (query = {}) {
      Object.keys(query).forEach((key) => {
        if (this._field_column.includes(key)) {
          console.log(this._query);
          this._query[key] = query[key];
        }
      });
    };


    this.get_list = function () {
      return this._list;
    };

    /**
     * get_links function
     *
     * @return mixed
     */
    this.get_links = function () {
      this._links = this.createLinks();
      return this._links;
    };

    /**
     * set_total_rows function
     *
     * @param integer total_rows
     * @return void
     */
    this.set_total_rows = function (total_rows) {
      this._total_rows = total_rows;
    };

    /**
     * set_per_page function
     *
     * @param integer per_page
     * @return void
     */
    this.set_per_page = function (per_page) {
      this._per_page = per_page;
    };
    /**
     * format_layout function
     *
     * @param integer _format_layout
     * @return void
     */
    this.set_format_layout = function (_format_layout) {
      this._format_layout = _format_layout;
    };

    /**
     * set_order_by function
     *
     * @param string order_by
     * @return void
     */
    this.set_order_by = function (order_by) {
      this._order_by = order_by;
    };

    /**
     * set_sort function
     *
     * @param string sort
     * @return void
     */
    this.set_sort = function (sort) {
      this._sort = sort;
    };

    /**
     * set_sort_base_url function
     *
     * @param string sort_base_url
     * @return void
     */
    this.set_sort_base_url = function (sort_base_url) {
      this._sort_base_url = sort_base_url;
    };

    /**
     * get_total_rows function
     *
     * @return integer
     */
    this.get_total_rows = function () {
      return this._total_rows;
    };

    /**
     * get_format_layout function
     *
     * @return integer
     */
    this.get_format_layout = function () {
      return this._format_layout;
    };

    /**
     * get_per_page function
     *
     * @return integer
     */
    this.get_per_page = function () {
      return this._per_page;
    };

    /**
     * get_page function
     *
     * @return integer
     */
    this.get_page = function () {
      return this._page;
    };

    /**
     * num_links function
     *
     * @return integer
     */
    this.get_num_links = function () {
      return this._num_links;
    };

    /**
     * set_order_by function
     *
     */
    this.get_order_by = function () {
      return this._order_by;
    };

    /**
     * get_field_column function
     *
     */
    this.get_field_column = function () {
      return this._field_column;
    };

    this.get_readable_field_column = function () {
      return this._readable_field_column;
    };

    /**
     * set_sort function
     *
     */
    this.get_sort = function () {
      return this._sort;
    };


    this.get_query = function () {
      return this._query;
    };


    /**
     * set_sort_base_url function
     *
     */
    this.get_sort_base_url = function () {
      return this._sort_base_url;
    };

    /**
     * set_page function
     *
     * @param integer page
     * @return void
     */
    this.set_page = function (page) {
      this._page = page;
    };

    /**
     * num_pages function
     *
     * @return integer
     */
    this.get_num_page = function () {
    let  num = Math.ceil(this._total_rows / this._per_page);
      return num > 0 ? parseInt(num) : 1;
    };

    this.image_or_file = function (file) {
      const images = [".jpg", ".png", ".gif", ".jpeg", ".bmp"];
      let is_image = false;
      const exist = images.filter(function (value) {
        return value.indexOf(file) > -1;
      });

      if (exist.length > 0) {
        return `<div class='mkd-image-container'><img class='img-fluid' src='${file}' onerror=\"if (this.src != '/uploads/placeholder.jpg') this.src = '/uploads/placeholder.jpg';\"/></div>`;
      }

      return `<a href='${file}' target='__blank'>${file}</a>`;
    };

    this.timeago = function (date) {
      const newDate = new Date(date);
      const today = new Date();
      const currentTime = today.getTime();
      const timestamp = newDate.getTime();

      const strTime = array("second", "minute", "hour", "day", "month", "year");
      const duration = array(60, 60, 24, 30, 12, 10);

      if (currentTime >= timestamp) {
        diff = currentTime - timestamp;

        for (let i = 0; diff >= duration[i] && i < duration.length - 1; i++) {
          diff = diff / duration[i];
        }

        diff = Math.round(diff, 0);
        return diff + " " + strTime[i] + "(s) ago ";
      }
    };

    this.time_default_mapping = function () {
      let results = [];
      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j++) {
          let hour = i < 10 ? "0" + i : i;
          let min = j < 10 ? "0" + j : j;
          results[i * 60 + j] = `${hour}:${min}`;
        }
      }
      return results;
    };

    this.convertToString = function (input) {
      if (input) {
        if (typeof input === "string") {
          return input;
        }

        return String(input);
      }
      return "";
    };

    // convert string to words
    this.toWords = function (input) {
      input = this.convertToString(input);

      var regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

      return input.match(regex);
    };

    // convert the input array to camel case
    this.toCamelCase = function (inputArray) {
      let result = "";

      for (let i = 0, len = inputArray.length; i < len; i++) {
        let currentStr = inputArray[i];

        let tempStr = currentStr.toLowerCase();

        if (i != 0) {
          // convert first letter to upper case (the word is in lowercase)
          tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
        }

        result += tempStr;
      }

      return result;
    };

    this.toCamelCaseString = function (input) {
      let words = this.toWords(input);

      return this.toCamelCase(words);
    };

    this.ucFirst = function (string) {
      if (typeof string === 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      return '';
    };
  

    this.number_format = function (field, n) {
      return field.toFixed(n);
    };

    this.date = function (d) {
      return (
        ("0" + (d.getMonth() + 1)).slice(-2) +
        " " +
        ("0" + d.getDate()).slice(-2) +
        " " +
        d.getFullYear()
      );
    };

    this.datetime = function (d) {
      return (
        ("0" + (d.getMonth() + 1)).slice(-2) +
        " " +
        ("0" + d.getDate()).slice(-2) +
        " " +
        d.getFullYear() +
        " " +
        ("0" + d.getHours()).slice(-2) +
        ":" +
        ("0" + d.getMinutes()).slice(-2)
      );
    };
    
    this.format_date_input = function(date){
      const d = new Date(date) 
      const year = d.getFullYear();
      const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1 }` : d.getMonth() + 1 ;
      const day = d.getDate() < 10 ? `0${d.getDate() }` : d.getDate() ;
      return `${year}-${month}-${day}`
    }
    // 2018-06-12T19:30
    this.format_date_local_input = function(date){
      const d = new Date(date) 
      const year = d.getFullYear();
      const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1 }` : d.getMonth() + 1 ;
      const day = d.getDate() < 10 ? `0${d.getDate() }` : d.getDate() ;
      const hrs = d.getHours() < 10 ? `0${d.getHours() }` : d.getHours() ;
      const mins = d.getMinutes() < 10 ? `0${d.getMinutes() }` : d.getMinutes() ;
      return `${year}-${month}-${day}T${hrs}:${mins}`
    }

    this.createLinks = function () {
      let totalItems = this._total_rows;
      let currentPage = this._page;
      let pageSize = this._per_page;
      let maxPages = 10;
      // calculate total pages
      let totalPages = Math.ceil(totalItems / pageSize);

      // ensure current page isn't out of range
      if (currentPage < 0) {
        currentPage = 0;
      } else if (currentPage > totalPages) {
        currentPage = +totalPages;
      }

      let startPage = 0;
      let endPage = 0;

      if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
      } else {
        // total pages more than max so calculate start and end pages
        let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
          // current page near the start
          startPage = 1;
          endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
          // current page near the end
          startPage = totalPages - maxPages + 1;
          endPage = totalPages;
        } else {
          // current page somewhere in the middle
          startPage = currentPage - maxPagesBeforeCurrentPage;
          endPage = currentPage + maxPagesAfterCurrentPage;
        }
      }

      // calculate start and end item indexes
      let startIndex = (currentPage - 1) * pageSize;
      let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

      // create an array of pages to ng-repeat in the pager control
      let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
        (i) => startPage + i
      );

    
      // return object with all pager properties required by the view
      const payload = {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages,
      };


      let html = '<ul class="pagination justify-content-end">';
      for (let i = 0; i < payload.pages.length && payload.pages.length > 1; i++) {
        const element = +payload.pages[i];
        if (element - 1 == payload.currentPage) {
          html += `<li class="page-item active"><a href="#" class="page-link" >${element}<span class="sr-only">(current)</span></a></li>`;
        } else {
          html += `<li class="page-item"><a href="${this._base_url}/${
            element - 1
          }?order_by=${this.get_order_by()}&amp;direction=${this.get_sort()}&amp;per_page=${this.get_per_page()}" class="page-link" data-ci-pagination-page="${element}">${element}</a></li>`;
        }
      }
      html += "</ul>";
      return html;
    };

    
	this.get_id = function () {
		return this._id;
	}

	this.set_id = function (id) {
		this._id = id;
	}

	this._id = null;

	this.get_section_title = function () {
		return this._section_title;
	}

	this.set_section_title = function (section_title) {
		this._section_title = section_title;
	}

	this._section_title = null;

    
    
	this.to_json = function ()	{
		let list = this.get_list();

		let clean_list = [];

		for (let key in list) {
			let value = list[key];
			let clean_list_entry = {};
			clean_list_entry["id"] = value["id"];
			clean_list_entry["section_title"] = value["section_title"];
			clean_list_entry["output_variable_list"] = value["output_variable_list"];
			clean_list.push(clean_list_entry);
		}

		return {
			"page" : this.get_page(),
			"num_page" : this.get_num_page(),
			"num_item" : this.get_total_rows(),
			"item" : clean_list
		};
	};

	this.to_csv = function ()	{
		let list = this.get_list();

		let clean_list = [];

		for (let key in list) {
			let value = list[key];
			let clean_list_entry = {};
			clean_list_entry["id"] = value["id"];
			clean_list_entry["section_title"] = value["section_title"];
			clean_list_entry["output_variable_list"] = value["output_variable_list"];
			clean_list.push(clean_list_entry);
		}

		const columns = this.get_field_column();

		const column_fields = this.get_readable_field_column();

		const fields = column_fields.filter(function(v, index){ 
if (v.length === 0) {columns.splice(index, 1);
}
return v.length > 0;});

		let csv = columns.join(",") + "\n";
		for (let i = 0; i < clean_list.length; i++) {
			let row = clean_list[i];
			let row_csv = [];
			for (const key in row) {
				let column = row[key];
				if (fields.includes(key)) {
					row_csv.push('"' + column + '"');
				}
			}
			csv = csv + row_csv.join(',') + "\n";
		}
		return csv;
}


    return this;
};
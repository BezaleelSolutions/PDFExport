function splitHTMLtoMultiPagePDFold(elem) {
    var htmlWidth = $("."+elem).width();
    htmlWidth=parseInt(htmlWidth * 0.75)+15;

    var htmlHeight = $("."+elem).height();
    htmlHeight=parseInt(htmlHeight * 0.75)+15;
   
    //var pdfWidth = htmlWidth + (15 * 2);
    //var pdfHeight = (pdfWidth * 1.5) + (15 * 2);

     var pdfWidth = htmlWidth;
    var pdfHeight = htmlHeight;
    
    //var doc = new jsPDF('p', 'pt', [ 595.28,  841.89]);
    var doc = new jsPDF('p', 'pt', [ htmlWidth+6,  htmlHeight+3]);
     //var doc = new jsPDF('p', 'pt', [$("body").width(), $("body").height()]);
    var pageCount = Math.ceil(htmlHeight / pdfHeight) - 1;


    html2canvas($("."+elem)[0], { allowTaint: true,quality:2,scale:2 }).then(function(canvas) {
        canvas.getContext('2d');

        var image = canvas.toDataURL("image/jpeg", 1.0);
        //doc.addImage(image, 'PNG', 15, 15, htmlWidth, htmlHeight);

        image.onload = () => {

            doc.addImage(image, 'jpeg', 3, 3, htmlWidth, htmlHeight);
        for (var i = 1; i <= pageCount; i++) {
            doc.addPage(595.28, 841.89);
            doc.addImage(image, 'jpeg', 15, -(841.89 * i)+15, htmlWidth, htmlHeight);
        }
        var name="<?= time();?>.pdf";
        doc.save(name);

        };

        


    });
};

function exportTableToCSV() {
    // Create a new workbook
    var wb = XLSX.utils.book_new();

    // Create a new worksheet data array
    var ws_data = [];
    var maxCols = 0;

    // Get all tables on the page
    var tables = document.querySelectorAll("#order_table, #order_table2, #order_table3");

    // First pass to determine the maximum number of columns
    tables.forEach(table => {
        var rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            var cells = row.querySelectorAll('td, th');
            if (cells.length > maxCols) {
                maxCols = cells.length;
            }
        });
    });

    // Second pass to populate ws_data and keep track of header cells
    var headerCells = [];
    tables.forEach((table, tableIndex) => {
        // Clone the table to avoid modifying the original DOM
        var clonedTable = table.cloneNode(true);

        // Replace <br> tags with newline characters (\r\n) in cell text content
        var cellsWithBr = clonedTable.querySelectorAll('td, th');
        cellsWithBr.forEach(cell => {
            var cellText = cell.innerHTML.replace(/<br\s*\/?>/gi, '');
            cell.innerHTML = cellText;
        });

        // Get table rows
        var rows = clonedTable.querySelectorAll('tr');
        rows.forEach(row => {
            var rowData = [];
            var cells = row.querySelectorAll('td, th');
            cells.forEach((cell, cellIndex) => {
                var cellText = cell.innerText.trim(); // Use innerText to get plain text
                rowData.push(cellText);

                // Track header cells
                if (cell.tagName.toLowerCase() === 'th') {
                    headerCells.push({ row: ws_data.length, col: cellIndex });
                }
            });
            // Ensure the row has the correct number of columns
            while (rowData.length < maxCols) {
                rowData.push(""); // Add empty strings for missing columns
            }
            ws_data.push(rowData);
        });

        // Add a blank row between tables
        if (tableIndex < tables.length - 1) {
            var blankRow = new Array(maxCols).fill("");
            ws_data.push(blankRow);
        }
    });

    // Convert the data array to a worksheet
    var ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Apply bold formatting to header cells
    headerCells.forEach(({ row, col }) => {
        var cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) ws[cellAddress] = { v: ws_data[row][col] };
        if (!ws[cellAddress].s) ws[cellAddress].s = { font: {} };
        ws[cellAddress].s.font.bold = true; // Apply bold style
    });

    // Append the single worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, "Report.xlsx");
}

//Use Strict Mode
(function($) {
  "use strict";

//Remove loading-wrapper class before window load
setTimeout(function(){
  $('.loading-wrapper').removeClass('loading-wrapper-hide');
  return false;
}, 10);

//Begin - Window Load
$(window).load(function(){

  //Page Loader 
  setTimeout(function(){
    $('#loader-name').addClass('loader-up');
    $('#loader-job').addClass('loader-up');
    $('#loader-animation').addClass('loader-up');
    return false;
  }, 500); 
  setTimeout(function(){
    //$('#page-loader').addClass('loader-out');
    $('#intro-item1').addClass('active');
    return false;    
  }, 1100);  
  //$('#page-loader').delay(1600).fadeOut(10);  
  setTimeout(function(){
    //$('#page-loader').hide();
    return false;    
  }, 1700);

  //back to top
  function backToTop() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
  }

  //Isotope
  var $isotopeContainer = $('#isotope-filter'),
  $isotopeOptionContainer = $('#options'),
  $options = $isotopeOptionContainer.find('a[href^="#"]').not('a[href="#"]'),
  isOptionLinkClicked = false;

  $isotopeContainer.imagesLoaded( function() {
    $isotopeContainer.isotope({
      itemSelector : '.element',
      resizable: false,
      //filter: '*',
      transitionDuration: '0.8s',
      layoutMode: 'packery',
      packery: {
        
      }
    });
  });

  function isotopeGO() {
      var isotopeItem = $(this),
      href = isotopeItem.attr('href');
        
      if ( isotopeItem.hasClass('selected') ) {
        return;
      } else {
        $options.removeClass('selected');
        isotopeItem.addClass('selected');
      }

      jQuery.bbq.pushState( '#' + href );
      isOptionLinkClicked = true;
      return false;
  }

  $options.on('click', function () {       
      isotopeGO();
  });

  $('.isotope-link').on('click', function () { 
      backToTop();
      isotopeGO();       
  });
  

  $(window).on( 'hashchange', function( event ){
    var isotopeFilter = window.location.hash.replace( /^#/, '');
    
    if( isotopeFilter == false )
      isotopeFilter = 'home';
      
    $isotopeContainer.imagesLoaded( function() {
      $isotopeContainer.isotope({
        filter: '.' + isotopeFilter
      });
    });
    
    if ( isOptionLinkClicked == false ){
      $options.removeClass('selected');
      $isotopeOptionContainer.find('a[href="#'+ isotopeFilter +'"]').addClass('selected');      
    }    
    
    isOptionLinkClicked = false;

  }).trigger('hashchange');


  $('.navbar-nav li a').on('click', function(){
    $('.navbar-nav li a').removeClass('activeMenu');
    $(this).addClass('activeMenu');
  });

  //Masonry Layout on Blog
  var $isotopeContainerBlog = $('#blog-posts-masonry')

  $isotopeContainerBlog.imagesLoaded( function() {
    $isotopeContainerBlog.isotope({
      itemSelector : '.blog-item',
      resizable: false,
      //filter: '*',
      transitionDuration: '0.8s',
      layoutMode: 'packery'
    });
  });  

});

//Begin - Document Ready
$(document).ready(function(){


// Double Tap to Go - Mobile Friendly SubMenus
$('.navbar-nav li:has(ul)').doubleTapToGo();

// Maps iframe Overlay
var map = $('#map');
map.on('click', function () {
    $('#map iframe').css("pointer-events", "auto");
    return false;
});

map.on('mouseleave', function () {
    $('#map iframe').css("pointer-events", "none");
    return false;
});

//Form Validator and Ajax Sender
$("#contactForm").validate({
  submitHandler: function(form) {
    $.ajax({
      type: "POST",
      url: "php/contact-form.php",
      data: {
        "name": $("#contactForm #name").val(),
        "email": $("#contactForm #email").val(),
        "subject": $("#contactForm #subject").val(),
        "message": $("#contactForm #message").val()
      },
      dataType: "json",
      success: function (data) {
        if (data.response == "success") {
          $('#contactWait').hide();
          $("#contactSuccess").fadeIn(300).addClass('modal-show');
          $("#contactError").addClass("hidden");  
          $("#contactForm #name, #contactForm #email, #contactForm #subject, #contactForm #message")
            .val("")
            .blur();         
        } else {
          $('#contactWait').hide();
          $("#contactError").fadeIn(300).addClass('modal-show');
          $("#contactSuccess").addClass("hidden");
        }
      },
      beforeSend: function() {
        $('#contactWait').fadeIn(200);
      }
    });
  }
});


//Modal for Contact Form
$('.modal-wrap').click(function(){
  $('.modal-wrap').fadeOut(300);
}); 

//Modal for Forms
function hideModal() {
  $('.modal-wrap').fadeOut(300);
  return false;
}

$('.modal-wrap').on('click', function () {
  hideModal();
});   

$('.modal-bg').on('click', function () {
  hideModal();
}); 

//bootstrap tooltips
$('[data-toggle="tooltip"]').tooltip();

 //Nivo Lightbox
  $('a.nivobox').nivoLightbox({ effect: 'fade' });

//End - Document Ready
});

//End - Use Strict mode
})(jQuery);


       
       
   



$(document).ready(function() {
  // Toggle filter menu visibility
  $('.settings-icon').on('click', function() {
    $('.filter-menu').toggle();
  });

  // Initialize event listeners
  initializeEventListeners();

  // Function to initialize event listeners
  function initializeEventListeners() {
    // Select all checkboxes with the name 'check'
    $('.filter-checkbox').on('click', function() {
      updateFilterVisibility($(this));
    });

    // Select the Restore to Default button
    $('#restore-all-filter').on('click', function() {
      showAllFilters();
    });
  }

  // Function to update filter element visibility
  function updateFilterVisibility($checkbox) {
    var filterId = $checkbox.attr('id');
    var $filterElement = $('[data-id="' + filterId + '"]');

    if ($filterElement.length) {
      if ($checkbox.is(':checked')) {
        $filterElement.show();
      } else {
        $filterElement.hide();
      }
      save_inhouse_filters($checkbox);
    }
  }

  // Function to show all filter elements
  function showAllFilters() {
    $('.filter-checkbox').each(function() {
      $(this).prop('checked', true);
      var filterId = $(this).attr('id');
      var $filterElement = $('[data-id="' + filterId + '"]');
      if ($filterElement.length) {
        $filterElement.show();
      }
    });

    // Assuming this is using jQuery to set all checkboxes
    $('.filter-checkbox').prop('checked', true);
    save_inhouse_filters('');
  }

  // Call this function after your AJAX call completes
  function onAjaxContentLoaded() {
    //initializeEventListeners();
  }

 
});

 

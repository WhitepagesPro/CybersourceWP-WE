var currURL = document.url || window.location.href || this.href;
// Make sure we are on a Decision Manager screen, on the initial load that
// contains the contact data (there is a subsequent load identified by the hash
// at the end of the URL that we don't want).
if((currURL.indexOf('DecisionManagerCaseManagementSearchExecute.do') >= 0 ||
  currURL.indexOf('CaseManagementDetailsLoad') >= 0) &&
  (currURL.indexOf('DecisionManagerCaseManagementSearchExecute.do#') == -1) &&
  (currURL.indexOf('CaseManagementDetailsLoad.do#') == -1))
{
	var wpIP, wpEmail, wpBillName, wpBillStreet, wpBillStreet2, wpBillCity,
  wpBillState, wpBillZip, wpBillCountry, wpBillPhone, wpShipName, wpShipStreet,
  wpShipStreet2, wpShipCity, wpShipState, wpShipZip, wpShipCountry, wpShipPhone;
	var wpErrors = [];

	// Find the order info table and iterate over its rows to find the transaction contact data
	var orderInfoTable = document.getElementById('orderInfoDataTbl');

	// If we failed to find this table, then there has been a site change
	if(!orderInfoTable)
		wpErrors.push('Failed to find the order info table due to website change. The Whitepages script will need to be updated.');
	else
	{
		var orderInfoRows = orderInfoTable.rows;

		for(var i = 0; i < orderInfoRows.length; i++)
		{
			var cols = orderInfoRows[i].cells;
			// If this row contains no data, skip it
			if(cols.length < 2)
				continue;
			// The first column should contain text describing the field on this row

			switch(cols[0].innerHTML)
			{
				case 'IP Address:':
					// The second column contains links to search the IP in addition to the
          // IP itself, so use RegEx to find the IP.
					var pattern = /\d+\.\d+\.\d+\.\d+/;
					wpIP = pattern.exec(cols[1].innerHTML);
					break;
				case 'Email Address:':
					// The second column contains an anchor tag whose text is the email.
					wpEmail = cols[1].childNodes[0].text;
					break;
			}
		}
		// Now identify the billing and shipping data.
		if(document.getElementById("billingName"))
			wpBillName = document.getElementById("billingName").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("billingAddress1"))
			wpBillStreet = document.getElementById("billingAddress1").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("billingAddress2"))
			wpBillStreet2 = document.getElementById("billingAddress2").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("billingCity"))
			wpBillCity = document.getElementById("billingCity").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("billingState"))
			wpBillState = document.getElementById("billingState").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("billingCountry"))
			wpBillCountry = document.getElementById("billingCountry").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ").toUpperCase();
		if(document.getElementById("billingZip"))
			wpBillZip = document.getElementById("billingZip").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("phoneLink"))
			wpBillPhone = document.getElementById("phoneLink").text.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		else{
			var pattern = /\d+/;
			var nodes = document.getElementById("billingHead").childNodes;
			var lastNode = nodes[nodes.length-1];
			wpBillPhone = pattern.exec(lastNode.nodeValue);
		}
		if(document.getElementById("shippingName"))
			wpShipName = document.getElementById("shippingName").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("shippingAddress1"))
			wpShipStreet = document.getElementById("shippingAddress1").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("shippingAddress2"))
			wpShipStreet2 = document.getElementById("shippingAddress2").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("shippingCity"))
			wpShipCity = document.getElementById("shippingCity").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("shippingState"))
			wpShipState = document.getElementById("shippingState").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("shippingZip"))
			wpShipZip = document.getElementById("shippingZip").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		if(document.getElementById("shippingCountry"))
			wpShipCountry = document.getElementById("shippingCountry").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ").toUpperCase();
		if(document.getElementById("shipPhoneLink"))
			wpShipPhone = document.getElementById("shipPhoneLink").text.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
		else{
			var pattern = /\d{10}\d*/;
			var nodes = document.getElementById("shippingHead");
			var lastNode = nodes.childNodes[nodes.childNodes.length-1];
			wpShipPhone = pattern.exec(lastNode.nodeValue);
		}
	}
	// Now we have all the input data, so we can build the Pro Web Identity Check URLs
	var wpURL = 'https://pro.lookup.whitepages.com/identity_checks?';
	wpURL += 'billing_name='+encodeURIComponent(wpBillName)+'&';
	if(wpBillPhone !== null)
		wpURL += 'billing_phone='+encodeURIComponent(wpBillPhone)+'&';
	// If we have calling code in phone, use that, otw use addy country
	if(wpBillPhone.length == 10)
		wpURL += 'billing_phone_country_hint='+encodeURIComponent(wpBillCountry)+'&';

	if(wpBillStreet != "1295 Charleston Rd" || wpBillZip != "30171"){
		wpURL += 'billing_address_street_line_1='+encodeURIComponent(wpBillStreet)+'&';
		if(document.getElementById("billingAddress2"))
			wpURL += 'billing_address_street_line_2='+encodeURIComponent(wpBillStreet2)+'&';
		wpURL += 'billing_address_city='+encodeURIComponent(wpBillCity)+'&';
		wpURL += 'billing_address_state_code='+encodeURIComponent(wpBillState)+'&';
		wpURL += 'billing_address_postal_code='+encodeURIComponent(wpBillZip)+'&';
		wpURL += 'billing_address_country_code='+encodeURIComponent(wpBillCountry)+'&';
	}

	wpURL += 'shipping_name='+encodeURIComponent(wpShipName)+'&';
	if(wpShipStreet !== null && (wpShipStreet != "1295 Charleston Rd" || wpShipZip != "30171")){
		wpURL += 'shipping_address_street_line_1='+encodeURIComponent(wpShipStreet)+'&';
		if(document.getElementById("shippingAddress2"))
			wpURL += 'shipping_address_street_line_2='+encodeURIComponent(wpShipStreet2)+'&';
		wpURL += 'shipping_address_city='+encodeURIComponent(wpShipCity)+'&';
		wpURL += 'shipping_address_state_code='+encodeURIComponent(wpShipState)+'&';
		wpURL += 'shipping_address_postal_code='+encodeURIComponent(wpShipZip)+'&';
		wpURL += 'shipping_address_country_code='+encodeURIComponent(wpShipCountry)+'&';
	}
    if(wpEmail != "null@cybersource.com" && wpEmail != "nobody@cybersource.com")
      wpURL += 'email_address='+encodeURIComponent(wpEmail)+'&';
	wpURL += 'ip_address='+encodeURIComponent(wpIP);
    wpURL = wpURL.replace(/\=undefined/g,'=');

	// Edit the phone links to go to Pro Web instead of whitepages.com
	if(document.getElementById("phoneLink"))
		document.getElementById("phoneLink").href = 'https://pro.lookup.whitepages.com/phones?number='+encodeURIComponent(wpBillPhone);
	if(document.getElementById("shipPhoneLink"))
		document.getElementById("shipPhoneLink").href = 'https://pro.lookup.whitepages.com/phones?number='+encodeURIComponent(wpShipPhone);
	// Now insert links for these Identity Check URLs into billing and shipping sections
	var a = document.createElement("a");
	var linkText = document.createTextNode("Verify with Whitepages Pro");
	a.href = wpURL;
	// The target is the name of the document this should load into; 'blank' says
  // to load in a new tab
	a.target = "_blank";
	a.appendChild(linkText);
	a.style.font = "bold 14px calibri";
	a.style.color = "#006699";

	// Find the table containing the billing and shipping columns
	var billingHeadTd = document.getElementById("billingHead");
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	td.style = "text-align:center;";
	td.style.textAlign='center';
	td.colSpan = 2;
	td.appendChild(a);
	tr.appendChild(td);
	billingHeadTd.parentNode.parentNode.parentNode.appendChild(tr);

}

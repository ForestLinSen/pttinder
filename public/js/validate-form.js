function validate()
{
	const petServices = document.getElementById("services");
	const checkboxes = document.getElementsByClassName("checkable-service-options");

	if(petServices.checked)
	{
		for(var i = 0; i < checkboxes.length; i++)
		{
			if(checkboxes[i].checked)
			{
				return true;
			}
		}

		if(!okay)
		{
			alert("Select at least one service.");
			return false; // Do not submit form if no services selected
		}
	}

	// submit form if okay is true or petServices unchecked.
}

function checkBeforeSearch()
{
	const parameters = document.getElementsByClassName("parameters");

	for(var i = 0; i < parameters.length; i++)
	{
		if(parameters[i].value != '')
		{
			return true;
		}
	}
	return false;
}
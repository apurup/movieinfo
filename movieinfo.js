

$('document').ready(function (){
        let selectedSerachType;
        let selectedYear;
        let searchString;
        $("#inputSearchType").change(function(){

            selectedSerachType = $("#inputSearchType").find("option:selected").val();
            //console.log(selectedSerachType);
            $("label[for='inputKey']").text(selectedSerachType);
            let selectedIndex = $("#inputSearchType").find("option:selected").index()
            if(selectedIndex===0)
            {
                $("#inputYear").removeAttr('disabled')
            }
            else if(selectedIndex === 1)
            {
                console.log("inselected")
                $("#inputYear").attr('disabled','disabled')
            }


        });


    $('#searchbtn').click(function (e) {

        e.preventDefault();

        let selectedIndex = $("#inputSearchType").find("option:selected").index()
        if($('#inputKey').val().length===0)
        {
            $('#inputKey').addClass('is-invalid')
        }
        else {
            $('#inputKey').removeClass('is-invalid')
            if(selectedIndex===0)
            {
                searchString="&s="+$('#inputKey').val().split(' ').join('+');
                console.log(searchString);
                if($('#inputYear').val().length!==0)
                {
                    searchString=searchString+"&y="+$('#inputYear').val();
                    console.log(searchString);
                }
                let poster;
                $.ajax({
                    type:'GET',
                    dataType:'json',
                    url:'https://www.omdbapi.com/?apikey=498f8b3f'+searchString,
                    beforeSend: function () {
                        $('#display').empty();
                        $('#display').append(`<img id="loadinggif" src="3.gif" height="64" width="64">`)
                    },
                    success: (data) => {
                        console.log(data)
                        console.log(data.Response)
                        if(data.Response==='True')
                        {
                            for (obj of data.Search) {
                                let string='';
                                for(key in obj)
                                {

                                    console.log(key+':'+obj[key]);
                                    if(key==='Poster')
                                    {
                                        poster=obj[key];
                                        if(poster==='N/A')
                                        {
                                            poster='images/movie.png';
                                        }
                                    }
                                    else {
                                        string = string+`<h5 class=" icard card-title" key="${key}" value = "${obj[key]}">${key} : ${obj[key]}</h5>`
                                    }

                                }
                                $('#display').append(`<div class="card mt-4 mb-4" style="width: 18rem;">
                <img class="card-img-top" height="300" width="100" src="${poster}" alt="Card image cap">
                        <div  class=" card-body d-flex flex-column">
                            ${string}
                            <button   class="btn btn-primary mt-auto veiwDetails" >View Details</button>
                        </div>
                    </div>`)

                            }
                        }
                        else {
                            $('#display').append(`<div class="display-4">No Movies Found!</div>`)
                        }


                    },
                    error: function () {
                        $('#display').prepend(`<p>Time Out Error</p>`)
                    },
                    complete : function () {
                        $('#loadinggif').remove();
                        //$(window).scrollTop($('#display').offset().top);
                        $('.veiwDetails').click(function () {
                            console.log('on click')
                            console.log($($(this).parent()).find('h5[key="imdbID"]').attr('value'))
                            getMovieDetails($($(this).parent()).find('h5[key="imdbID"]').attr('value'));
                            /*$('.media').remove()
                            $('#display').prepend(`<div class="media" style="background: white">
                        <img class="mr-3" src="https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg" alt="Generic placeholder image">
                        <div class="media-body">
                            <h5 class="mt-0">Media heading</h5>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </div>
                    </div>`)
                            $('#display').scrollTop(0)*/
                        })

                    }
                });
            }
            else if(selectedIndex===1)
            {
                getMovieDetails($('#inputKey').val())
            }

        }

    });

    function getMovieDetails(imdbid) {
        //alert('http://www.omdbapi.com/?apikey=498f8b3f&i='+imdbid)
        $.ajax({
            type:'GET',
            dataType:'json',
            url:'https://www.omdbapi.com/?apikey=498f8b3f&i='+imdbid,
            success:(data) =>{
                console.log(data)
                let obj=data;
                let poster,string,heading='';
                string='';
                if(data.Response==='True')
                {
                    for(key in obj)
                    {

                        console.log(key+':'+obj[key]);
                        if(key==='Poster')
                        {
                            poster=obj[key];
                            if(poster==='N/A')
                            {
                                poster='images/movie.png';
                            }
                        }
                        else if(key ==='Title')
                        {
                            heading=obj[key];
                        }
                        else if(key ==='Ratings')
                        {

                        }
                        else if(key ==='Response')
                        {

                        }
                        else if(key ==='Website' && obj[key]!=='N/A')
                        {

                            string = string+`<p  key="${key}" value = "${obj[key]}">${key} : <a href="${obj[key]}">click here</a></p>`

                        }
                        else {
                            string = string+`<p  key="${key}" value = "${obj[key]}">${key} : ${obj[key]}</p>`
                        }

                    }
                    $('.idisplay').remove()
                    $('#display').prepend(`<div class="idisplay container-fluid d-flex flex-lg-row flex-md-row flex-column " style="background: white;overflow-y: scroll">
                <img height="300"  class=" mt-5 mr-md-3 d-flex justify-content-center sm-col-12" src="${poster}" alt="Generic placeholder image">
                <div class=" d-flex flex-column">
                    
                    <h5 class="display-4 mt-5 text-align-center">${heading}</h5>
                    ${string}
                </div>
            </div>`)
                }
                else {
                    $('#display').append(`<div class="display-4">No Movies Found!</div>`)
                }
                $('#display').scrollTop(0)
            },
            error: function () {
                $('#display').prepend(`<p>Time Out Error</p>`)
            },
            complete: function () {
                $(window).scrollTop($('#display').offset().top);
            }
        })
    }
    /*$( function() {
        $( "#inputYear" ).datepicker({

        });
    } );*/
    $('#display').on('scroll',function () {
        $(window).scrollTop($('#display').offset().top);
    })

})


import { Link } from "react-router-dom";

export default function About()
{
    return <div className="container">
        <div className="text-center"><h1 className="display-4">About</h1></div>
        <div className="border border-1 rounded-2 shadow-sm p-3">
            <p>This is a simulation of a small store located at the center of London.</p>
            <p>This is the very first project using ASP.Net created with the intention to study the technology itself and some other conventions, protocols, etc. Throughout the course the following was covered:</p>
            <ul>
                <li>Razor</li>
                <li>Inversion of control</li>
                <li>Single page application aka SPA</li>
                <li>Ways of working with forms</li>
                <li>Display templates</li>
                <li>Concepts of data accessors</li>
                <li>Middlewares</li>
                <li>Filters</li>
                <li>Differences between MVC and API controllers</li>
            </ul>
        </div>

        <div className="row mt-4">
            <iframe allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2480.4941392585656!2d0.0713844!3d51.5591743!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487b726560e6c1af%3A0xfde09925b79c885a!2sNext!5e0!3m2!1sen!2sua!4v1746805571445!5m2!1sen!2sua"/>
        </div>

        <div className="mt-4 border border-1 rounded-2 p-3">
            <h3>MVC and API</h3>
            <h4>Differences between MVC and API controllers</h4>
            <ul>
                <li>MVC: one method (usually GET) and different addresses (You can reach ONE address with ONE method, action is determined by address) GET /home/privacy -{'>'} HomeController::Privacy() POST /home/index -{'>'} HomeController::Index() (Post makes no difference, we will end up on Index)</li>
                <li>API: one address, but different methods GET /api/product -{'>'} ProductController::ProductsList() POST /api/product -{'>'} ProductController::CreateProduct() PUT /api/product</li>
            </ul>
            <p>MVC - returns IActionResult API - returns objects of an arbitrary type that ASP changes them to JSON (except for string, it changes to plain/text)</p>
        </div>

        <div className="border border-1 rounded-2 p-3 mt-4">
            <div className="h-1">Contacts</div>
            <div className="h-5 text-break d-inline-block">
                <p>Address:
                <a className="h-5 nav-link" href="https://maps.app.goo.gl/gxRm2kqU3Gusx6FaA">Havelock St Unit 1a, West Mall Exchange Shopping Centre, Ilford IG1 1BY, United Kingdom</a></p>
            </div>
            <div className="h-5 d-inline">
                <p>Email:
                <a className="h-5 nav-link" href="mailto:next@gmail.com">store@gmail.com</a></p>
            </div>
            <div className="h-5 d-inline">
                <p>Tel:
                <a className="h-5 nav-link" href="tel:+380 00 0000">+44 0000 000000</a></p> 
            </div>
        </div>
        <a href="#top" className="btn btn-dark mt-3 mb-4" >To the top</a>
    </div>
 
}
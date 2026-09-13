package rpg.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import rpg.backend.service.JwtService;
import rpg.backend.service.MyUserdetailsService;

import java.io.IOException;

@Component
//OncePerRequestFilter: for every request , execute this once
public class JwtFilter extends OncePerRequestFilter {


    @Autowired
    JwtService jwtService;

    @Autowired
    ApplicationContext context;     //not injecting directly due to cyclic dependency





    @Override
    //FilterChain: after this, call which filter?
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        // if user is not already authenticated
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){

            UserDetails userDetails = context.getBean(MyUserdetailsService.class).loadUserByUsername(username);

            //validating token
            if(jwtService.validateToken(token,userDetails)){


                System.out.println(userDetails.getAuthorities());

                //creating authentication Object (this is basically Authentication Object when provided these arguments)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());

                //extra details about request like ip,sessionid,requestmeta data
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        //forwarding to next filter
        filterChain.doFilter(request,response);

    }
}

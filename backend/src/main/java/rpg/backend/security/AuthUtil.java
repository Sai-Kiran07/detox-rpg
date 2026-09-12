package rpg.backend.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import rpg.backend.entity.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class AuthUtil {

    Date now = new Date();
    @Value("${jwt.secretkey}")
    private String jwtsecretkey;
    private SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(jwtsecretkey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessKey(User user){
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId",user.getId().toString())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + 10L * 24 * 60 * 60 * 1000))
                .signWith(getSecretKey())
                .compact();
}

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }
}

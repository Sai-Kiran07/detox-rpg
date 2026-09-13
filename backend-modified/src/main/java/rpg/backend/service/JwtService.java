package rpg.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    //HardCoding Key (not a encyrpted key)
    private static final String SECRET = "TwteuiB7HUDDJnm&Edhbsoi";

    //Randomly generation keys
    private final String secretKey;

    public JwtService() {
        secretKey = generateSecretKey();
    }

    public String generateSecretKey(){
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secretKey = keyGen.generateKey();
            System.out.println("SECRET: "+secretKey.toString());
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());   //encoding key


        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (Exception e){
            throw new RuntimeException("SecretKey cant be genereated");
        }
    }


    public String generateToken(String username) {

        //Get every Claims(userinfo)
        Map<String, Object> claims = new HashMap<>();


        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000*60*2))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();   //compact everything into a string


        /** HEADER + PAYLOAD + SECRET_KEY
         ↓
         SHA256 HMAC
         ↓
         SIGNATURE
         **/
    }

    private Key getKey(){

        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {

        //getSubject means username
        return extractClaim(token, Claims::getSubject);

    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {

        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);

    }

    private Claims extractAllClaims(String token) {


        /** JWT String
         ↓
         Verify Signature
         ↓
         Decode Payload
         ↓
         Create Claims Object
         ↓
         Extract Requested Claim
         */

        return Jwts.parser()    //ectracting jwt
                .setSigningKey(getKey())
                .build()
                .parseSignedClaims(token).getBody();   // jwt verification happening here
    }

    public boolean validateToken(String token, UserDetails userDetails) {

        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));



    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return  extractClaim(token,Claims::getExpiration);
    }
}

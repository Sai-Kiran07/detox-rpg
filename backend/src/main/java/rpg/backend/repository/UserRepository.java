package rpg.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import rpg.backend.entity.User;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByUsername(String username);
}

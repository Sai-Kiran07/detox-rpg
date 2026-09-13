package rpg.backend.dto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rpg.backend.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    public User findByUsername(String username);
}

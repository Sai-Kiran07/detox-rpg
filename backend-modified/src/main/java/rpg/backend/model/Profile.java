package rpg.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String callsign;

    private Integer level;
    private Integer xp;
    private Integer score;
    private Integer tickets;
    private Integer unspentSkillPoints;

    private Integer hp;
    private Integer maxHp;
    private Integer energy;
    private Integer maxEnergy;

    private Integer streak;
    private Integer streakShields;
    private String lastCheckInDate;

    private String avatar;

    @Embedded
    private Attributes attributes;
}